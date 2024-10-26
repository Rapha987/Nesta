// Aggiungi questo script prima del tag di chiusura </body> nel file HTML
<script>
    document.getElementById('contact-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Previene il comportamento predefinito del form
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        alert(`Grazie, ${name}! La tua richiesta è stata inviata.`);
        
        // Qui puoi aggiungere il codice per inviare i dati ad un server tramite AJAX o Fetch API
    });
</script>
