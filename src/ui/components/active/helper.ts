export default function active([path]) {
  return path === location.hash ? 'active' : '';
}
