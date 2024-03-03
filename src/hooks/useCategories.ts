import { useOrbis } from '@orbisclub/components';
import { useQuery } from '@tanstack/react-query';

const useCategories = () => {
  const { orbis } = useOrbis();

  const loadContexts = async () => {
    let { data, error } = await orbis.api
      .from('orbis_contexts')
      .select()
      .neq('stream_id', process.env.NEXT_PUBLIC_TAGS_STREAM_ID)
      .eq('context', (global as any).orbis_context)
      .order('created_at', { ascending: false });
    return data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: loadContexts,
  });

  return { categories: data as any[], isLoading };
};

export default useCategories;
