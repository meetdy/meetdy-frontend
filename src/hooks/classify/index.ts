import { useQuery, useMutation } from '@tanstack/react-query';

import ServiceClassify from '@/api/classifyApi';
import { queryClient } from '@/queries/core';

import { IAddClassify, IClassify, IColor } from '@/models/classify.model';

export const CLASSIFY_QUERY_KEY = {
  ROOT: 'classify',
  LIST: 'list',
  COLOR: 'color',
};

export const classifyFactory = {
  all: () => [CLASSIFY_QUERY_KEY.ROOT],

  list: () => [CLASSIFY_QUERY_KEY.ROOT, CLASSIFY_QUERY_KEY.LIST],

  colors: () => [CLASSIFY_QUERY_KEY.ROOT, CLASSIFY_QUERY_KEY.COLOR],
};

export function useGetListClassify() {
  return useQuery<IClassify[]>({
    queryKey: classifyFactory.list(),
    queryFn: ServiceClassify.getClassifies,
  });
}

export function useGetListColor() {
  return useQuery<IColor[]>({
    queryKey: classifyFactory.colors(),
    queryFn: ServiceClassify.getColors,
  });
}

/* -------------------------------------------------------------------------- */
/*                                  Mutations                                 */
/* -------------------------------------------------------------------------- */

function invalidateClassifyCore() {
  queryClient.invalidateQueries({
    queryKey: classifyFactory.all(),
  });
}

/* ------------------------------ Add Classify ------------------------------ */

export function useAddClassify() {
  return useMutation({
    mutationFn: (params: IAddClassify) => ServiceClassify.addClassify(params),

    onSuccess: invalidateClassifyCore,
  });
}

/* ---------------------------- Update Classify ----------------------------- */

export function useUpdateClassify() {
  return useMutation({
    mutationFn: ({
      classifyId,
      data,
    }: {
      classifyId: string;
      data: IAddClassify;
    }) => ServiceClassify.updateClassify(classifyId, data),

    onSuccess: invalidateClassifyCore,
  });
}

/* ---------------------------- Delete Classify ----------------------------- */

export function useDeleteClassify() {
  return useMutation({
    mutationFn: (classifyId: string) =>
      ServiceClassify.deleteClassify(classifyId),

    onSuccess: invalidateClassifyCore,
  });
}

/* ----------------------- Bind Classify To Conversation --------------------- */

export function useAddClassifyForConversation() {
  return useMutation({
    mutationFn: ({
      classifyId,
      conversationId,
    }: {
      classifyId: string;
      conversationId: string;
    }) =>
      ServiceClassify.addClassifyForConversation(classifyId, conversationId),

    onSuccess: invalidateClassifyCore,
  });
}

/* --------------------- Remove Classify From Conversation ------------------- */

export function useRemoveClassifyFromConversation() {
  return useMutation({
    mutationFn: ({
      classifyId,
      conversationId,
    }: {
      classifyId: string;
      conversationId: string;
    }) =>
      ServiceClassify.removeClassifyFromConversation(
        classifyId,
        conversationId,
      ),

    onSuccess: invalidateClassifyCore,
  });
}
