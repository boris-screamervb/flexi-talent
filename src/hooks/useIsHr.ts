import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useIsHr = () => {
  return useQuery({
    queryKey: ["is_hr"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("is_hr");
      if (error) return false;
      return !!data;
    },
    staleTime: 60_000,
  });
};
