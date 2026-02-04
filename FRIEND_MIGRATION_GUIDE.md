# Friend Feature Migration Guide: Redux → React Query

## Overview

The friend feature has been refactored from Redux Toolkit's `createAsyncThunk` to React Query for better data fetching, caching, and state management.

## What Changed

### ✅ Removed from Redux

- ❌ `fetchListRequestFriend` thunk
- ❌ `fetchListMyRequestFriend` thunk
- ❌ `fetchFriends` thunk
- ❌ `fetchListGroup` thunk
- ❌ `fetchPhoneBook` thunk
- ❌ `fetchSuggestFriend` thunk
- ❌ All related Redux state (friends, requestFriends, myRequestFriend, etc.)
- ❌ Loading states in Redux

### ✅ Added React Query Hooks

#### Query Hooks (Data Fetching)

```typescript
// Get friends list
useGetFriends({ params: { name: '' }, enabled: true });

// Get incoming friend requests
useGetListRequestFriend({ enabled: true });

// Get my sent friend requests
useGetMyRequestFriend({ enabled: true });

// Get suggested friends
useGetSuggestFriend({ params: { page: 0, size: 12 }, enabled: true });

// Get phone book contacts
useGetPhoneBook({ enabled: true });
```

#### Mutation Hooks (Data Modification)

```typescript
// Accept a friend request
useAcceptRequestFriend();

// Delete a friend
useDeleteFriend();

// Reject an incoming friend request
useDeleteRequestFriend();

// Cancel a sent friend request
useDeleteSentRequestFriend();

// Send a friend request
useSendRequestFriend();
```

### ✅ Kept in Redux (UI State Only)

```typescript
// Notification count management
setAmountNotify(count);
incrementNotify();
decrementNotify();
resetNotify();
```

## Migration Examples

### Before (Redux)

```typescript
import { useDispatch, useSelector } from 'react-redux';
import { fetchFriends, fetchListRequestFriend } from '@/app/friendSlice';

function MyComponent() {
  const dispatch = useDispatch();
  const { friends, isLoading } = useSelector(state => state.friend);

  useEffect(() => {
    dispatch(fetchFriends({ name: '' }));
  }, [dispatch]);

  if (isLoading) return <Loading />;

  return <div>{friends.map(...)}</div>;
}
```

### After (React Query)

```typescript
import { useGetFriends } from '@/hooks/friend';

function MyComponent() {
  const { friends, isFetching } = useGetFriends({
    params: { name: '' }
  });

  if (isFetching) return <Loading />;

  return <div>{friends.map(...)}</div>;
}
```

### Mutations - Before

```typescript
import { useDispatch } from 'react-redux';
import friendApi from '@/api/friendApi';
import { fetchListRequestFriend } from '@/app/friendSlice';

function AcceptButton({ userId }) {
  const dispatch = useDispatch();

  const handleAccept = async () => {
    try {
      await friendApi.acceptRequestFriend(userId);
      dispatch(fetchListRequestFriend());
      toast.success('Accepted!');
    } catch (error) {
      toast.error('Failed');
    }
  };

  return <button onClick={handleAccept}>Accept</button>;
}
```

### Mutations - After

```typescript
import { useAcceptRequestFriend } from '@/hooks/friend';

function AcceptButton({ userId }) {
  const { mutate: acceptRequest, isPending } = useAcceptRequestFriend();

  const handleAccept = () => {
    acceptRequest(userId);
    // Cache invalidation and toasts are handled automatically!
  };

  return (
    <button onClick={handleAccept} disabled={isPending}>
      {isPending ? 'Accepting...' : 'Accept'}
    </button>
  );
}
```

## Key Benefits

### 1. **Automatic Cache Management**

- No manual refetching needed
- Smart cache invalidation on mutations
- Stale-while-revalidate pattern

### 2. **Better Loading States**

```typescript
const {
  friends,
  isFetching, // Currently fetching
  isFetched, // Has fetched at least once
  isError, // Error occurred
  error, // Error details
} = useGetFriends({ params: { name: '' } });
```

### 3. **Optimistic Updates** (built-in support)

```typescript
const { mutate } = useSendRequestFriend();

// Mutations automatically invalidate related queries
mutate(userId); // Will refetch myRequestFriends and suggestFriends
```

### 4. **Error Handling**

All mutations include automatic error toasts with Vietnamese messages:

- ✅ Success: "Đã gửi lời mời kết bạn"
- ❌ Error: "Không thể gửi lời mời kết bạn"

### 5. **Cache Configuration**

Each hook has optimized cache times based on data volatility:

```typescript
// Frequently changing data
useGetListRequestFriend(); // 2 min stale, 5 min cache

// Less frequent changes
useGetFriends(); // 5 min stale, 10 min cache

// Rarely changing data
useGetSuggestFriend(); // 10 min stale, 30 min cache
useGetPhoneBook(); // 30 min stale, 60 min cache
```

## Cache Invalidation Flow

### Accept Friend Request

```
useAcceptRequestFriend() →
  ✓ Invalidates fetchListRequestFriend
  ✓ Invalidates getFriends
  ✓ Shows success toast
```

### Send Friend Request

```
useSendRequestFriend() →
  ✓ Invalidates fetchMyRequestFriend
  ✓ Invalidates fetchSuggestFriend (all pages)
  ✓ Shows success toast
```

### Delete Friend

```
useDeleteFriend() →
  ✓ Invalidates getFriends
  ✓ Shows success toast
```

## Breaking Changes & Migration Steps

### Step 1: Remove Redux Dispatches

```diff
- import { fetchFriends } from '@/app/friendSlice';
- const dispatch = useDispatch();
- dispatch(fetchFriends({ name: '' }));

+ import { useGetFriends } from '@/hooks/friend';
+ const { friends } = useGetFriends({ params: { name: '' } });
```

### Step 2: Update Selectors

```diff
- const { friends, isLoading } = useSelector(state => state.friend);

+ const { friends, isFetching } = useGetFriends({ params: { name: '' } });
```

### Step 3: Replace Manual Mutations

```diff
- await friendApi.acceptRequestFriend(userId);
- dispatch(fetchListRequestFriend());
- dispatch(fetchFriends({ name: '' }));

+ const { mutate } = useAcceptRequestFriend();
+ mutate(userId); // Automatic cache invalidation!
```

### Step 4: Notification Count (Still in Redux)

```typescript
import { useDispatch } from 'react-redux';
import { setAmountNotify } from '@/app/friendSlice';

// Update notification count when requests change
const { requestFriends } = useGetListRequestFriend();

useEffect(() => {
  dispatch(setAmountNotify(requestFriends.length));
}, [requestFriends.length, dispatch]);
```

## Files Modified

### Hooks

- ✅ `/hooks/friend/useGetFriends.ts`
- ✅ `/hooks/friend/useGetListRequestFriend.ts`
- ✅ `/hooks/friend/useGetMyRequestFriend.ts`
- ✅ `/hooks/friend/useGetSuggestFriend.ts`
- ✅ `/hooks/friend/useGetPhoneBook.ts` (NEW)
- ✅ `/hooks/friend/useAcceptRequestFriend.ts`
- ✅ `/hooks/friend/useDeleteFriend.ts`
- ✅ `/hooks/friend/useDeleteRequestFriend.ts`
- ✅ `/hooks/friend/useDeleteSentRequestFriend.ts`
- ✅ `/hooks/friend/useSendRequestFriend.ts`
- ✅ `/hooks/friend/index.ts` (NEW - barrel export)

### Redux

- ✅ `/app/friendSlice.ts` - Simplified to UI state only

## Testing Checklist

- [ ] Friend list loads correctly
- [ ] Incoming friend requests display
- [ ] Sent friend requests display
- [ ] Suggested friends load
- [ ] Accept request updates both lists
- [ ] Reject request removes from list
- [ ] Send request adds to sent list
- [ ] Cancel sent request removes it
- [ ] Delete friend updates list
- [ ] Success/error toasts appear
- [ ] Loading states work correctly
- [ ] Cache invalidation works
- [ ] Notification count updates

## Performance Improvements

1. **Reduced Bundle Size**: Removed Redux boilerplate
2. **Better Caching**: Smart cache with configurable stale times
3. **Automatic Deduplication**: Multiple components using same query = single request
4. **Background Refetching**: Updates data without blocking UI
5. **Optimistic Updates**: UI feels instant

## Need Help?

Common patterns:

```typescript
// Conditional fetching
useGetFriends({ params: { name: '' }, enabled: !!userId });

// Manual refetch
const { refetch } = useGetFriends({ params: { name: '' } });
refetch();

// Mutation with callback
const { mutate } = useAcceptRequestFriend();
mutate(userId, {
  onSuccess: () => console.log('Success!'),
  onError: (error) => console.error(error),
});
```
