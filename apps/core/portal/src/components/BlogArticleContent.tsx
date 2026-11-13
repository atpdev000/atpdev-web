import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function BlogArticleContent({ content }: { content: string }) {
  return (
    <div className="prose prose-lg max-w-none space-y-6">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ ...props }) => (
            <h2
              className="text-2xl sm:text-3xl font-extrabold mt-10 mb-4 tracking-tight border-b pb-2"
              style={{ color: 'var(--text-color)', borderColor: 'var(--glass-border)' }}
              {...props}
            />
          ),
          h3: ({ ...props }) => (
            <h3
              className="text-xl sm:text-2xl font-bold mt-7 mb-3"
              style={{ color: 'var(--text-color)' }}
              {...props}
            />
          ),
          p: ({ ...props }) => (
            <p
              className="text-base sm:text-[17px] leading-relaxed mb-4"
              style={{ color: 'var(--text-muted)' }}
              {...props}
            />
          ),
          ul: ({ ...props }) => (
            <ul className="list-disc pl-6 space-y-2.5 mb-5" style={{ color: 'var(--text-muted)' }} {...props} />
          ),
          ol: ({ ...props }) => (
            <ol className="list-decimal pl-6 space-y-2.5 mb-5" style={{ color: 'var(--text-muted)' }} {...props} />
          ),
          li: ({ ...props }) => <li className="leading-relaxed" {...props} />,
          strong: ({ ...props }) => (
            <strong className="font-bold" style={{ color: 'var(--text-color)' }} {...props} />
          ),
          pre: ({ ...props }) => (
            <pre
              className="overflow-x-auto rounded-2xl p-5 my-6 text-xs sm:text-sm font-mono leading-relaxed border bg-[#0b101b] text-slate-100 border-slate-800 shadow-lg"
              {...props}
            />
          ),
          code: ({ className, children, ...props }) => {
            const isBlock = Boolean(className && className.includes('language-'));
            if (isBlock) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
            return (
              <code
                className="px-1.5 py-0.5 rounded-md text-[0.9em] font-mono border"
                style={{
                  backgroundColor: 'var(--glass-bg)',
                  borderColor: 'var(--glass-border)',
                  color: 'var(--accent-text)',
                }}
                {...props}
              >
                {children}
              </code>
            );
          },
          blockquote: ({ ...props }) => (
            <blockquote
              className="border-l-4 pl-4 italic my-6 py-1"
              style={{ borderColor: 'var(--accent-text)', color: 'var(--text-muted)' }}
              {...props}
            />
          ),
          a: ({ href, children, ...props }) => (
            <a
              href={href}
              className="underline font-semibold hover:opacity-80 transition-opacity"
              style={{ color: 'var(--accent-text)' }}
              {...props}
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

