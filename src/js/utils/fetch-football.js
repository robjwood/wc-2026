const API = '/api/football';

export async function fetchData(type) {
  const res = await fetch(`${API}?type=${type}`);
  if (!res.ok) throw new Error(`Failed to fetch ${type}`);
  return res.json();
}
