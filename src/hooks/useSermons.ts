import { useQuery } from "@tanstack/react-query";
import { fetchAllSermons, Sermon } from "@/lib/sermonLoader";

/**
 * Loads the sermon archive once and keeps it for the session.
 *
 * Sermon content is static files served from `dist`, so there is nothing to
 * revalidate. Using React Query (already mounted in App.tsx) means /ask does not
 * re-fetch all 28 files when the visitor has already browsed /sermons.
 */
export const useSermons = () =>
  useQuery<Sermon[]>({
    queryKey: ["sermons"],
    queryFn: fetchAllSermons,
    staleTime: Infinity,
    gcTime: Infinity,
  });
