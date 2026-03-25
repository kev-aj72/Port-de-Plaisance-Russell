 // script pour modifier un utillisateur
 
 async function updateUser(email, id) {
        const data = {
            username: document.getElementById('username-' + id).value,
            password: document.getElementById('password-' + id).value
        };

        try {
            const res = await fetch('/users/' + encodeURIComponent(email), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || 'Erreur modification');
            }

            alert('Utilisateur modifié');
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert(error.message || 'Erreur modification');
        }
    }

    //script pour effacer un utillisateur 

    async function deleteUser(email) {
        const ok = confirm('Supprimer votre compte ?');
        if (!ok) return;

        try {
            const res = await fetch('/users/' + encodeURIComponent(email), {
                method: 'DELETE'
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || 'Erreur suppression');
            }

            alert('Compte supprimé');
            window.location.href = result.redirect || '/';
        } catch (error) {
            console.error(error);
            alert(error.message || 'Erreur suppression');
        }
    }