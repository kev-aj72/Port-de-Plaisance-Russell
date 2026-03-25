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
            window.location.href = '/app/reservations';
        } catch (error) {
            console.error('Erreur suppression :', error);
            alert('Erreur suppression');
        }
    }