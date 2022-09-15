numeroCommande()
//affiche le numéro de commande
function numeroCommande(){
    let orderId = (new URL(document.location)).searchParams.get('orderId')
    document.getElementById('orderId').textContent = orderId
}