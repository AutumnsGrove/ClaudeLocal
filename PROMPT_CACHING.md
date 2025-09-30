# Prompt Caching Implementation

ClaudeLocal uses Anthropic's **Prompt Caching** feature to dramatically reduce API costs and latency.

## What is Prompt Caching?

Prompt caching allows you to cache frequently used context (like conversation history or project instructions) so you don't pay full price for the same tokens repeatedly.

### Benefits

- **90% cost reduction** on cached tokens
- **Lower latency** - cached content loads instantly
- **5-minute TTL** - cache persists across requests within 5 minutes
- **Automatic management** - Anthropic handles cache lifecycle

## How We Implement It

### 1. Project Instructions Caching

When a conversation belongs to a project with custom instructions:

```typescript
const systemMessages = [{
  type: 'text',
  text: project.instructions,
  cache_control: { type: 'ephemeral' }  // ← Cache this!
}];
```

**Savings**: If your project instructions are 2000 tokens, you pay full price once, then 90% less for every subsequent message in the next 5 minutes.

### 2. Conversation History Caching

Older messages in the conversation are marked for caching:

```typescript
const formattedMessages = messages.map((msg, index) => {
  const isLastUserMessage = index === messages.length - 1;
  const shouldCache = !isLastUserMessage && messages.length > 2;

  return {
    role: msg.role,
    content: shouldCache ? [
      {
        type: 'text',
        text: msg.content,
        cache_control: { type: 'ephemeral' }  // ← Cache historical messages
      }
    ] : msg.content
  };
});
```

**Savings**: In a 20-message conversation, messages 1-19 are cached. Only the latest user message is "fresh" input.

## Minimum Cache Size

Anthropic requires **1024 tokens minimum** for caching. Our implementation:
- ✅ Long project instructions (usually >1024 tokens)
- ✅ Multi-turn conversations (accumulates >1024 tokens quickly)
- ✅ Files uploaded to projects (typically >1024 tokens)

## Example Cost Savings

### Scenario: 10-message conversation with project instructions

**Without caching:**
```
Message 1: 1500 tokens × $3/MTok = $0.0045
Message 2: 3000 tokens × $3/MTok = $0.0090
Message 3: 4500 tokens × $3/MTok = $0.0135
Message 4: 6000 tokens × $3/MTok = $0.0180
...
Total: $0.15 (estimated)
```

**With caching:**
```
Message 1: 1500 tokens × $3/MTok = $0.0045
Message 2: 1500 cached × $0.30/MTok + 1500 new = $0.0050
Message 3: 3000 cached × $0.30/MTok + 1500 new = $0.0055
Message 4: 4500 cached × $0.30/MTok + 1500 new = $0.0060
...
Total: $0.03 (estimated) - 80% savings!
```

## Cache Lifecycle

1. **First request**: Context sent normally, cache created
2. **Subsequent requests** (within 5 min): Cached context retrieved, only new tokens charged
3. **After 5 minutes**: Cache expires, process repeats

## Implementation Details

### File: `app/api/chat/route.ts`

Key sections:
- Lines 75-93: Message caching logic
- Lines 95-104: System message (project instructions) caching
- Line 111: System messages passed to Anthropic API

### Cache Control Header

```typescript
cache_control: { type: 'ephemeral' }
```

This tells Anthropic to cache this content block for 5 minutes.

## Monitoring Cache Performance

The Anthropic API response includes cache performance metrics in the `usage` object:

```typescript
{
  usage: {
    input_tokens: 1500,
    cache_creation_input_tokens: 1500,  // First time
    cache_read_input_tokens: 0,         // First time
    output_tokens: 800
  }
}
```

On subsequent requests:
```typescript
{
  usage: {
    input_tokens: 100,                  // Only new input
    cache_creation_input_tokens: 0,
    cache_read_input_tokens: 1500,      // Retrieved from cache!
    output_tokens: 800
  }
}
```

## Best Practices

1. **Cache stable content**: Project instructions, conversation history
2. **Don't cache dynamic content**: The latest user message
3. **Minimum 1024 tokens**: Ensure cached blocks are large enough
4. **Sequential caching**: Cache blocks must be in order

## Future Enhancements

- [ ] Display cache metrics in UI (tokens cached/saved)
- [ ] User setting to enable/disable caching
- [ ] Analytics dashboard showing cost savings over time
- [ ] Cache warm-up for frequently accessed projects

## References

- [Anthropic Prompt Caching Documentation](https://docs.anthropic.com/claude/docs/prompt-caching)
- [Pricing with Caching](https://www.anthropic.com/pricing#prompt-caching)

---

**Result**: ClaudeLocal automatically optimizes your API costs with zero user configuration required!
