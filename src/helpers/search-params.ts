import { useQueryStates } from "nuqs";
import { parseAsInteger, parseAsString } from "nuqs/server";
import { useCallback, useRef } from "react";

export function useParams() {
  const [params, setParams] = useQueryStates({
    q: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
    tech: parseAsString
      .withDefault("")
      .withOptions({ clearOnDefault: true, shallow: false }),
    limit: parseAsInteger.withDefault(10).withOptions({ clearOnDefault: true }),
    page: parseAsInteger
      .withDefault(1)
      .withOptions({ clearOnDefault: true, shallow: false }),
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const setParamsWithDelay = useCallback(
    (newParams: Partial<typeof params>) => {
      if ("q" in newParams) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        setParams({ q: newParams.q }, { shallow: true });

        timeoutRef.current = setTimeout(() => {
          setParams({ q: newParams.q }, { shallow: false });
        }, 1000);

        const { q, ...restParams } = newParams;
        if (Object.keys(restParams).length > 0) {
          setParams(restParams);
        }
      } else {
        setParams(newParams);
      }
    },
    [setParams],
  );

  return {
    ...params,
    setParams: setParamsWithDelay,
  };
}
