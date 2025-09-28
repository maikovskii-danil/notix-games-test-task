import { debounce } from '@/utils/debounce';
import { useEffect, useState } from 'react';

let abortController: AbortController | null = null;

const debouncedFetchFn = debounce(
  (
    search: string,
    setSearchResult: (result: Array<{ id: number; title: string }>) => void,
  ) => {
    if (abortController) {
      abortController.abort();
    }

    abortController = new AbortController();

    const signal = abortController.signal;

    fetch('/api/rest/suggestions?search=' + search, { signal })
      .then((response) => response.json())
      .then(
        (json: {
          data: Array<{ id: number; title: string }>;
          count: number;
          query: string | null;
        }) => {
          if (signal.aborted) {
            return;
          }
          setSearchResult(json.data);
        },
      );
  },
);

export default function App() {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState<
    Array<{ id: number; title: string }>
  >([]);

  useEffect(() => {
    debouncedFetchFn(search, setSearchResult);
  }, [search, setSearchResult]);

  return (
    <div className="m-8">
      <p className="text-gray-200 text-2xl mb-4">Type text here:</p>
      <input
        className="bg-gray-900 outline-none p-2 rounded text-gray-100 w-full"
        type="text"
        value={search}
        placeholder="Input..."
        onChange={(evt) => {
          setSearch(evt.target.value);
        }}
      />
      {searchResult
        .filter((item) =>
          item.title.toLowerCase().includes(search.toLowerCase()),
        )
        .map((item) => (
          <div
            key={item.id}
            className="text-gray-200 bg-gray-900 mt-2 p-2 rounded"
          >
            {item.title}
          </div>
        ))}
    </div>
  );
}
