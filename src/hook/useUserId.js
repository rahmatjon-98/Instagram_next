import { jwtDecode } from "jwt-decode";

export const useUserId = () => {
  
  const token = localStorage.getItem("access_token");
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded?.sid || null;
  } catch (e) {
    console.error(e);
    localStorage.removeItem("access_token");
    return null;
  }
};
