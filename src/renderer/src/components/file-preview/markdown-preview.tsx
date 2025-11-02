import { memo, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
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
          <div className="max-w-none">
            {hasFrontmatter && (
              <div className="mb-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Property</TableHead>
                      <TableHead>Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(frontmatter).map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell className="font-mono text-sm">{key}</TableCell>
                        <TableCell>
                          {typeof value === 'object'
                            ? JSON.stringify(value, null, 2)
                            : String(value)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkFrontmatter]}
              rehypePlugins={[rehypeRaw, rehypeSanitize]}
              components={{
                h1: ({ children }) => (
                  <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight mt-8 mb-4">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mt-6 mb-3">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-5 mb-2">
                    {children}
                  </h3>
                ),
                h4: ({ children }) => (
                  <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mt-4 mb-2">
                    {children}
                  </h4>
                ),
                p: ({ children }) => <p className="leading-7 not-first:mt-6">{children}</p>,
                blockquote: ({ children }) => (
                  <blockquote className="mt-6 border-l-2 pl-6 italic">{children}</blockquote>
                ),
                ul: ({ children }) => (
                  <ul className="my-6 ml-6 list-disc [&>li]:mt-2">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">{children}</ol>
                ),
                li: ({ children }) => <li>{children}</li>,
                code: ({ children, ...props }) => {
                  const match = /language-(\w+)/.exec(props.className || '');
                  return !match ? (
                    <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                      {children}
                    </code>
                  ) : (
                    <code className="font-mono" {...props}>
                      {children}
                    </code>
                  );
                },
                pre: ({ children }) => (
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-4">{children}</pre>
                ),
                table: ({ children }) => (
                  <div className="my-6 w-full overflow-y-auto">
                    <Table>{children}</Table>
                  </div>
                ),
                thead: ({ children }) => <TableHeader>{children}</TableHeader>,
                tbody: ({ children }) => <TableBody>{children}</TableBody>,
                tr: ({ children }) => <TableRow>{children}</TableRow>,
                th: ({ children }) => <TableHead>{children}</TableHead>,
                td: ({ children }) => <TableCell>{children}</TableCell>,
                a: ({ children, href }) => (
                  <a
                    href={href}
                    className="text-primary underline underline-offset-4 hover:text-primary/80"
                  >
                    {children}
                  </a>
                ),
                strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                hr: () => <hr className="border-border my-8" />,
                img: ({ src, alt }) => (
                  <img src={src} alt={alt} className="rounded-lg my-4 max-w-full" />
                )
              }}
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
