function prefix(key: string) {
  return `__cra11y_${key}`;
}

export function get(key: string): string {
  return (window as any).estore.get(prefix(key));
}

export function store(key: string, data: any) {
  try {
    (window as any).estore.set(prefix(key), data);
  } catch (error) {
    console.log('store error', error);
  }
}
