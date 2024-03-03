import { useOrbis } from '@orbisclub/components';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const useTags = () => {
  const { orbis } = useOrbis();

  const queryClient = useQueryClient();

  const loadContexts = async () => {
    let { data, error } = await orbis.api
      .from('orbis_contexts')
      .select()
      .eq('context', process.env.NEXT_PUBLIC_TAGS_STREAM_ID)
      .order('created_at', { ascending: false });
    return data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ['tags'],
    queryFn: loadContexts,
  });

  const createTag = async (tag: string) => {
    const res = await orbis.createContext({
      name: tag.toLowerCase(),
      displayName: tag.toLowerCase(),
      context: process.env.NEXT_PUBLIC_TAGS_STREAM_ID,
      project_id: process.env.NEXT_PUBLIC_PROJECT_ID,
    });
    return res;
  };

  const createTagMutation = useMutation({
    mutationKey: ['create-tag'],
    mutationFn: createTag,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tags'] }),
  });

  return { tags: data as any[], isLoading, createTagMutation };
};

export default useTags;
