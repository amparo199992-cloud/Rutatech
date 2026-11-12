import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// react-markdown no interpreta HTML crudo: el contenido es seguro aunque lo edite un administrador.
const components = {
  a: ({ href, children }) => {
    const external = href?.startsWith("http");
    return (
      <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {children}
      </a>
    );
  },
  pre: ({ children }) => <pre tabIndex={0}>{children}</pre>,
};

export default function Markdown({ children, className = "prose-ruta" }) {
  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
