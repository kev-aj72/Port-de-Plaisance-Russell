   
   // script modification Reservation

   async function updateReservation(id, catwayNumber) {
        const data = {
            clientName: document.getElementById('clientName-' + id).value,
            boatName: document.getElementById('boatName-' + id).value,
            startDate: document.getElementById('startDate-' + id).value,
            endDate: document.getElementById('endDate-' + id).value
        };

        try {
            const res = await fetch('/catways/' + catwayNumber + '/reservations/' + id, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || 'Erreur modification');
            }

            alert('Réservation modifiée');
            window.location.reload();
        } catch (error) {
            console.error('Erreur modification :', error);
            alert('Erreur modification');
        }
    }


//script suppression reservation

    async function deleteReservation(id, catwayNumber) {
        if (!confirm('Supprimer ?')) return;

        try {
            const res = await fetch('/catways/' + catwayNumber + '/reservations/' + id, {
                method: 'DELETE'
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || 'Erreur suppression');
            }

            alert('Réservation supprimée');
            window.location.reload();
        } catch (error) {
            console.error('Erreur suppression :', error);
            alert('Erreur suppression');
        }
    }

    //script modification catway

    async function updateCatway(id) {
    const data = {
        catwayState: document.getElementById('catwayState').value
    };

    try {
        const res = await fetch('/catways/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!res.ok) throw new Error();

        alert('Catway modifié');
        window.location.reload();
    } catch (error) {
        console.error(error);
        alert('Erreur modification catway');
    }
}

    // script suppression catway

async function deleteCatway(id) {
    const ok = confirm('Supprimer ce catway ?');
    if (!ok) return;

    try {
        const res = await fetch('/catways/' + id, {
            method: 'DELETE'
        });

        if (!res.ok) throw new Error();

        window.location.href = '/app/catways';
    } catch (error) {
        console.error(error);
        alert('Erreur suppression catway');
    }
}
