import { useEffect } from 'react';
import CheckLink, {
  replaceConentWithouLink,
  replaceContentToLink,
} from '@/utils/linkHelper';

import { LinkPreview } from '@dhaiwat10/react-link-preview';
import parse from 'html-react-parser';
import { CheckCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

import ReplyMessage from './ReplyMessage';

function TextMessage({
  content,
  children,
  dateAt,
  isSeen,
  replyMessage,
  tags,
}) {
  const handleOnClickTag = () => {
    console.log('tag');
  };
  useEffect(() => {
    tags.forEach((tag) => {
      const temp = document.getElementById(`mtc-${tag._id}`);

      if (temp) {
        temp.onclick = handleOnClickTag;
      }
    });
  }, [tags]);

  const tranferTextToTagUser = (contentMes, tagUser) => {
    let tempContent = contentMes;

    if (tagUser.length > 0) {
      tags.forEach((ele) => {
        tempContent = tempContent.replace(
          `@${ele.name}`,
          `<span id='mtc-${ele._id}' class="text-primary font-medium cursor-pointer hover:underline">@${ele.name}</span>`,
        );
      });
    }
    return parse(tempContent);
  };

  const matchesLink = CheckLink(content);

  const renderMessageText = (contentMes) => {
    if (!matchesLink || matchesLink.length === 0) {
      return (
        <div className="text-[15px] leading-relaxed break-words whitespace-pre-wrap">
          {tags.length > 0
            ? tranferTextToTagUser(contentMes, tags)
            : contentMes}
        </div>
      );
    }

    // Single link - show preview
    if (matchesLink.length === 1) {
      const linkUrl = matchesLink[0];
      const textWithoutLink = replaceConentWithouLink(contentMes, linkUrl).trim();

      return (
        <div className="space-y-2.5">
          {textWithoutLink && (
            <div className="text-[15px] leading-relaxed break-words whitespace-pre-wrap">
              {tags.length > 0
                ? tranferTextToTagUser(textWithoutLink, tags)
                : textWithoutLink}
            </div>
          )}
          <div className="rounded-lg overflow-hidden border border-border/60 bg-background/50 hover:bg-background transition-colors">
            <LinkPreview
              url={linkUrl}
              imageHeight="160px"
              width="100%"
              fallback={
                <a
                  href={linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 text-sm text-primary hover:underline break-all"
                >
                  {linkUrl}
                </a>
              }
              showLoader={false}
            />
          </div>
        </div>
      );
    }

    // Multiple links - show as clickable text
    return (
      <div className="text-[15px] leading-relaxed break-words whitespace-pre-wrap">
        {tags.length > 0
          ? tranferTextToTagUser(
            replaceContentToLink(contentMes, matchesLink),
            tags,
          )
          : parse(replaceContentToLink(contentMes, matchesLink))}
      </div>
    );
  };

  return (
    <div className="space-y-1">
      {replyMessage && Object.keys(replyMessage).length > 0 && (
        <ReplyMessage replyMessage={replyMessage} />
      )}

      {renderMessageText(content)}

      <div className="flex items-center gap-1.5 text-[11px] opacity-70 select-none">
        <span>
          {`0${dateAt.getHours()}`.slice(-2)}:
          {`0${dateAt.getMinutes()}`.slice(-2)}
        </span>
        {isSeen && (
          <span className="flex items-center gap-0.5 text-emerald-500">
            <CheckCheck className="w-3.5 h-3.5" />
          </span>
        )}
      </div>

      {children}
    </div>
  );
}

export default TextMessage;
