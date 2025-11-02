import { memo, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import type { MarkdownPreviewProps } from './types';

interface FrontmatterData {
  [key: string]: string | number | boolean | string[] | number[] | Record<string, unknown>;
}

function parseFrontmatter(content: string): {
  frontmatter: FrontmatterData | null;
  markdownContent: string;
} {
  const yamlMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const tomlMatch = content.match(/^\+\+\+\n([\s\S]*?)\n\+\+\+\n([\s\S]*)$/);

  if (yamlMatch) {
    const [, yamlContent, markdown] = yamlMatch;
    const frontmatter: FrontmatterData = {};

    yamlContent.split('\n').forEach(line => {
      const match = line.match(/^(\w+):\s*(.+)$/);
      if (match) {
        const [, key, value] = match;
        const trimmedValue = value.trim();

        if (trimmedValue.startsWith('[') && trimmedValue.endsWith(']')) {
          try {
            frontmatter[key] = JSON.parse(trimmedValue) as string[] | number[];
          } catch {
            frontmatter[key] = trimmedValue;
          }
        } else if (trimmedValue === 'true' || trimmedValue === 'false') {
          frontmatter[key] = trimmedValue === 'true';
        } else if (!isNaN(Number(trimmedValue)) && trimmedValue !== '') {
          frontmatter[key] = Number(trimmedValue);
        } else {
          frontmatter[key] = trimmedValue.replace(/^["']|["']$/g, '');
        }
      }
    });

    return {
      frontmatter: Object.keys(frontmatter).length > 0 ? frontmatter : null,
      markdownContent: markdown
    };
  }

  if (tomlMatch) {
    const [, tomlContent, markdown] = tomlMatch;
    const frontmatter: FrontmatterData = {};

    tomlContent.split('\n').forEach(line => {
      const match = line.match(/^(\w+)\s*=\s*(.+)$/);
      if (match) {
        const [, key, value] = match;
        const trimmedValue = value.trim();

        if (trimmedValue.startsWith('[') && trimmedValue.endsWith(']')) {
          try {
            frontmatter[key] = JSON.parse(trimmedValue) as string[] | number[];
          } catch {
            frontmatter[key] = trimmedValue;
          }
        } else if (trimmedValue === 'true' || trimmedValue === 'false') {
          frontmatter[key] = trimmedValue === 'true';
        } else if (!isNaN(Number(trimmedValue)) && trimmedValue !== '') {
          frontmatter[key] = Number(trimmedValue);
        } else {
          frontmatter[key] = trimmedValue.replace(/^["']|["']$/g, '');
        }
      }
    });

    return {
      frontmatter: Object.keys(frontmatter).length > 0 ? frontmatter : null,
      markdownContent: markdown
    };
  }

  return {
    frontmatter: null,
    markdownContent: content
  };
}

export const MarkdownPreview = memo(({ data, mode, onModeChange }: MarkdownPreviewProps) => {
  const { encoding, content: rawContent, fileName } = data;
  const content = encoding === 'base64' ? atob(rawContent) : rawContent;

  const { frontmatter, markdownContent } = useMemo(() => {
    return parseFrontmatter(content);
  }, [content]);

  const hasFrontmatter = frontmatter && Object.keys(frontmatter).length > 0;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-sm font-medium">{fileName}</h3>
        <button
          onClick={() => onModeChange(mode === 'rendered' ? 'raw' : 'rendered')}
          className="px-3 py-1 text-sm rounded-md bg-secondary hover:bg-secondary/80 transition-colors"
        >
          {mode === 'rendered' ? 'Show Raw' : 'Show Rendered'}
        </button>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {mode === 'rendered' ? (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {hasFrontmatter && (
              <div className="mb-6 overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border border-border bg-muted px-4 py-2 text-left font-semibold">
                        Property
                      </th>
                      <th className="border border-border bg-muted px-4 py-2 text-left font-semibold">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(frontmatter).map(([key, value]) => (
                      <tr key={key}>
                        <td className="border border-border px-4 py-2 font-mono text-sm">{key}</td>
                        <td className="border border-border px-4 py-2">
                          {typeof value === 'object'
                            ? JSON.stringify(value, null, 2)
                            : String(value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkFrontmatter]}
              rehypePlugins={[rehypeRaw, rehypeSanitize]}
            >
              {markdownContent}
            </ReactMarkdown>
          </div>
        ) : (
          <pre className="text-sm font-mono whitespace-pre-wrap">{content}</pre>
        )}
      </div>
    </div>
  );
});

MarkdownPreview.displayName = 'MarkdownPreview';
