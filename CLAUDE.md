# Claude Code Development Workflow

## Development Pipeline

All code changes MUST follow this pipeline:

1. **Submission** - Identify and document the issue/feature
2. **Review/Audit** - Analyze the codebase to understand the problem
3. **Develop** - Create a feature branch and implement the fix
4. **Test** - Verify the fix works correctly
5. **Merge** - Create a pull request and merge to main

## Workflow Steps

### 1. Submission Phase
When an error or feature request is identified:
- Document the error message or feature requirements
- Note the affected files/components
- Identify the root cause

### 2. Review/Audit Phase
Before making changes:
- Read relevant source files
- Understand the data flow and dependencies
- Identify all files that need modification
- Plan the solution approach

### 3. Develop Phase
Implement the solution:
```bash
# Create a feature branch
git checkout -b fix/descriptive-name
# or
git checkout -b feature/descriptive-name

# Make your changes
# Edit files as needed

# Stage changes
git add .

# Commit with descriptive message
git commit -m "Fix: [Brief description]

- [Detailed change 1]
- [Detailed change 2]
- [Additional context]

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### 4. Test Phase
Verify the fix:
- Run the development server
- Test the specific functionality
- Check for console errors
- Verify related features still work
- Run build to ensure no TypeScript errors

```bash
npm run dev    # Test in development
npm run build  # Ensure production build works
```

### 5. Merge Phase
Create and merge pull request:
```bash
# Push the feature branch
git push -u origin fix/descriptive-name

# Create PR with detailed description
gh pr create --title "Fix: [Issue description]" --body "$(cat <<'EOF'
## Summary
- Brief description of what was fixed/added

## Root Cause
- Explanation of why the issue occurred

## Solution
- How the fix addresses the root cause
- Technical details of the implementation

## Testing
- [x] Tested in development mode
- [x] Verified production build succeeds
- [x] Checked for console errors
- [x] Related features verified

## Files Changed
- `path/to/file1.ts` - Description of changes
- `path/to/file2.tsx` - Description of changes

🤖 Generated with [Claude Code](https://claude.ai/code)
EOF
)"

# After review, merge the PR
gh pr merge --squash --delete-branch
```

## Branch Naming Conventions

- `fix/` - Bug fixes (e.g., `fix/chat-error-handling`)
- `feature/` - New features (e.g., `feature/file-upload`)
- `refactor/` - Code refactoring (e.g., `refactor/api-routes`)
- `docs/` - Documentation updates (e.g., `docs/api-endpoints`)
- `test/` - Test additions (e.g., `test/message-flow`)

## Commit Message Format

```
[Type]: [Brief summary in present tense]

- [Specific change with technical detail]
- [Another specific change]
- [Additional context or reasoning]
- [Impact on other components]

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Commit Types
- **Fix** - Bug fixes
- **Add** - New features or files
- **Update** - Improvements to existing features
- **Refactor** - Code restructuring without functionality changes
- **Remove** - Deletion of features or deprecated code
- **Docs** - Documentation changes

## Example Full Workflow

```bash
# 1. Create branch
git checkout -b fix/api-chat-messages-route

# 2. Make changes (edit files)

# 3. Test
npm run dev
# Verify fix works

# 4. Commit
git add .
git commit -m "Fix: Add missing messages API route

- Created /api/conversations/[id]/messages/route.ts
- Implements GET endpoint to fetch conversation messages
- Returns messages with attachments in chronological order
- Fixes 404 error when loading conversation history

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# 5. Push and create PR
git push -u origin fix/api-chat-messages-route
gh pr create --title "Fix: Add missing messages API route" --body "..."

# 6. Merge
gh pr merge --squash --delete-branch

# 7. Return to main
git checkout main
git pull
```

## Error Handling Protocol

When errors occur during development:

1. **Capture the error**
   - Full error message
   - Stack trace
   - Request/response details
   - Browser console logs

2. **Identify the source**
   - Which API endpoint failed
   - What triggered the error
   - Expected vs actual behavior

3. **Follow the pipeline**
   - Don't make ad-hoc fixes on main
   - Always use feature branches
   - Always create PRs even for small fixes

4. **Document thoroughly**
   - Explain the root cause
   - Describe the solution
   - Note any side effects
   - Update relevant docs

## Quality Checklist

Before merging any PR:

- [ ] Code follows TypeScript best practices
- [ ] No TypeScript errors (`npm run build` succeeds)
- [ ] No console errors in development
- [ ] Feature works as expected
- [ ] Related features still work
- [ ] Error handling is comprehensive
- [ ] Code is properly typed (no `any` unless necessary)
- [ ] Commit messages are descriptive
- [ ] PR description is complete

## Project-Specific Notes

### API Routes
- All routes in `app/api/` must use Next.js 15 async params
- Use `const { param } = await params;` for dynamic routes
- Always include error handling with try/catch
- Return appropriate HTTP status codes

### Database Queries
- Use Prisma for all database operations
- Include necessary relations with `include`
- Handle null cases explicitly
- Log queries in development for debugging

### Frontend Components
- Use TypeScript strict mode
- Properly type all props
- Handle loading and error states
- Use React hooks correctly (deps array, cleanup)

### Authentication & Security
- API keys in `secrets.json` (gitignored)
- Never expose secrets to client
- Validate all user inputs
- Use proper CORS settings

---

**Always follow this workflow. No exceptions.**
