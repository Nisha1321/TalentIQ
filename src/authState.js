export const isAuthed = () => {
    try { return !!JSON.parse(localStorage.getItem("tiq_auth"))?.email; }
    catch { return false; }
};
export const signOut = () => {
    localStorage.removeItem("tiq_auth");
    window.location.href = "/signup";
};
