//petit script pour faire apparaitre est disparaitre le formulaire inscription
function showRegister() {
    document.getElementById('registerSection').style.display = 'block';
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('loginTitle').style.display = 'none';
}

function showLogin() {
    document.getElementById('registerSection').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('loginTitle').style.display = 'block';
}
