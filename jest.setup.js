import '@testing-library/jest-dom'

// jsdom doesn't implement IntersectionObserver, which framer-motion's
// `whileInView` (used for scroll-reveal animations) needs to even mount.
class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.IntersectionObserver = MockIntersectionObserver
