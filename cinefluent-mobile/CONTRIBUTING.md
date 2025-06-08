# Contributing to CineFluent

Thank you for your interest in contributing to CineFluent! This guide will help you get started.

## 🚀 Getting Started

### Development Setup
1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and configure
4. Start the development server: `npm run dev`

### Prerequisites
- Node.js 18+
- Modern web browser
- Basic knowledge of React and TypeScript
- Familiarity with mobile-first design principles

## 🎯 Areas for Contribution

### High Priority
- **Mobile UX Improvements**: Better touch interactions, gestures
- **Performance Optimization**: Bundle size, loading times
- **Accessibility**: WCAG compliance, screen reader support
- **Testing**: Unit tests, integration tests, E2E tests

### Medium Priority
- **New Features**: Offline mode, push notifications
- **UI Polish**: Animations, micro-interactions
- **Documentation**: Component docs, tutorials
- **Internationalization**: Multi-language support

### Low Priority
- **Code Quality**: Refactoring, type improvements
- **Build Tools**: Optimization, CI/CD improvements

## 📝 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow the existing component patterns
- Use Tailwind CSS for styling (avoid custom CSS)
- Implement mobile-first responsive design
- Add proper TypeScript types

### Component Guidelines
```typescript
// ✅ Good component structure
interface ComponentProps {
  title: string;
  onAction: () => void;
  variant?: 'default' | 'primary';
}

export function Component({ title, onAction, variant = 'default' }: ComponentProps) {
  return (
    <div className="mobile-card p-4">
      <h2 className="text-title">{title}</h2>
      <Button onClick={onAction} variant={variant}>
        Action
      </Button>
    </div>
  );
}
```

### Mobile Optimization
- Use `btn-mobile` class for buttons (44px min touch target)
- Implement proper safe area handling
- Test on various screen sizes
- Use `touch-target` class for interactive elements
- Consider thumb navigation zones

### API Integration
- Use the existing `apiService` in `src/lib/api.ts`
- Handle loading and error states properly
- Implement optimistic updates where appropriate
- Use React Query for data fetching

## 🧪 Testing

### Running Tests
```bash
npm run type-check    # TypeScript validation
npm run lint         # Code linting
npm run build        # Production build test
```

### Test Guidelines
- Write tests for new components
- Test mobile interactions and responsive behavior
- Include accessibility tests
- Test error scenarios

## 📱 Mobile Testing

### Browser Testing
- Chrome DevTools mobile simulation
- Firefox responsive design mode
- Safari responsive design mode

### Device Testing (Recommended)
- iOS Safari (iPhone)
- Android Chrome
- Test on both phones and tablets

## 🔄 Pull Request Process

1. **Create an Issue**: Describe the problem or feature
2. **Fork & Branch**: Create a descriptive branch name
3. **Develop**: Make your changes following the guidelines
4. **Test**: Ensure everything works on mobile
5. **Document**: Update docs if needed
6. **Submit**: Create a clear pull request

### PR Requirements
- [ ] Code follows the style guidelines
- [ ] Changes work on mobile devices
- [ ] TypeScript builds without errors
- [ ] No console errors or warnings
- [ ] Documentation updated (if applicable)
- [ ] Responsive design tested

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested on mobile devices
- [ ] TypeScript passes
- [ ] No console errors

## Screenshots
(Mobile screenshots appreciated)
```

## 🎨 Design Guidelines

### Colors
Use the defined CSS variables:
- `--primary` (CineFluent Blue)
- `--success`, `--warning`, `--destructive`
- Follow dark mode support

### Typography
- Use predefined text classes: `text-headline`, `text-title`, `text-body`, `text-caption`
- Support Dynamic Type on iOS
- Maintain good contrast ratios

### Spacing
- Use Tailwind spacing scale
- Follow 8pt grid system
- Use `mobile-card` class for cards

## 💡 Tips for New Contributors

1. **Start Small**: Look for "good first issue" labels
2. **Ask Questions**: Use GitHub Discussions for clarification
3. **Mobile First**: Always test on mobile devices
4. **Read Code**: Understand existing patterns before adding new ones
5. **Performance**: Consider mobile performance in all changes

## 🐛 Reporting Issues

### Bug Reports
Include:
- Device and browser information
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (especially mobile)

### Feature Requests
- Describe the problem it solves
- Consider mobile user experience
- Provide mockups if applicable

## 📞 Getting Help

- 💬 [GitHub Discussions](../../discussions) - General questions
- 🐛 [Issues](../../issues) - Bug reports and feature requests
- 📖 [Documentation](./docs/) - Technical guides

Thank you for contributing to CineFluent! 🎬✨
