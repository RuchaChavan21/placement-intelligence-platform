
// Renders the small subset of markdown the backend's LLM produces
// (**bold**, "- " bullet lists, "1. " numbered lists, paragraphs) as React
// elements. No HTML is injected, so model output can't run scripts.

const BULLET = /^\s*[-*•]\s+(.*)$/;
const NUMBERED = /^\s*\d+[.)]\s+(.*)$/;

function renderInline(text, keyPrefix) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') && part.length > 4 ? (
      <strong key={`${keyPrefix}-${i}`} className="font-semibold text-white">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    )
  );
}

export function formatMessage(text) {
  const blocks = [];
  let list = null;

  const flushList = () => {
    if (list) blocks.push(list);
    list = null;
  };

  text.split('\n').forEach((rawLine, i) => {
    const line = rawLine.trimEnd();
    const bullet = line.match(BULLET);
    const numbered = !bullet && line.match(NUMBERED);

    if (bullet || numbered) {
      const type = bullet ? 'ul' : 'ol';
      if (!list || list.type !== type) {
        flushList();
        list = { type, items: [] };
      }
      list.items.push((bullet || numbered)[1]);
      return;
    }

    flushList();
    if (line.trim()) blocks.push({ type: 'p', text: line.trim(), key: i });
  });
  flushList();

  return blocks.map((block, b) => {
    if (block.type === 'p') {
      return <p key={`p-${b}`}>{renderInline(block.text, `p-${b}`)}</p>;
    }
    const ListTag = block.type;
    return (
      <ListTag
        key={`l-${b}`}
        className={`${block.type === 'ul' ? 'list-disc' : 'list-decimal'} pl-5 space-y-1 marker:text-gold-500`}
      >
        {block.items.map((item, i) => (
          <li key={i}>{renderInline(item, `l-${b}-${i}`)}</li>
        ))}
      </ListTag>
    );
  });
}
