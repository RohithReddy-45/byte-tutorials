import { useQueryStates } from "nuqs";
import { parseAsInteger, parseAsString } from "nuqs/server";
import { useCallback, useRef } from "react";

export function useParams() {
  const [params, setParams] = useQueryStates({
    q: parseAsString.withDefault("").withOptions({ clearOnDefault: true, history: "replace" }),
    tech: parseAsString
      .withDefault("")
      .withOptions({
        clearOnDefault: true,
        shallow: false,
        history: "replace",
      }),
    page: parseAsInteger
      .withDefault(1)
      .withOptions({ clearOnDefault: true, shallow: false }),
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const setParamsWithDelay = useCallback(
    (newParams: Partial<typeof params>) => {
      const requiresPageReset = 'q' in newParams || 'tech' in newParams;
      const mergedParams = requiresPageReset
        ? { ...newParams, page: 1 }
        : newParams;

      if ('q' in mergedParams) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        setParams(
          { q: mergedParams.q, page: mergedParams.page },
          { shallow: true }
        );

        timeoutRef.current = setTimeout(() => {
          setParams(
            { q: mergedParams.q, page: mergedParams.page },
            { shallow: false, history: "replace" }
          );
        }, 500);

        const { q, page, ...restParams } = mergedParams;
        if (Object.keys(restParams).length > 0) {
          setParams(restParams);
        }
      } else {
        setParams(mergedParams);
      }
    },
    [setParams]
  );

  return {
    ...params,
    setParams: setParamsWithDelay,
  };
}
