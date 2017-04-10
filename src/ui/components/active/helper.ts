export default function active([path]) {
  return path === location.pathname ? 'active' : '';
}