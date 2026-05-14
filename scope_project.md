Définition du problème

        Les Algériens de la diaspora qui rentrent au pays par avion n'ont aucun moyen fiable de réserver une voiture a l'avance depuis l'etranger. A leur arrivée a l'aeroport, ils doivent chercher une voiture sur place, souvent dans des conditions de stress, sans garantie de disponibilité ni de prix fixe.

Problèmes identifiés: 

    •	Pas de plateforme digitale dédiée a la réservation de voitures aux aéroports algériens
    •	Impossibilité de planifier sa mobilité avant d'atterrir
    •	Manque de transparence sur les prix et les conditions de location
    •	Risque de double réservation sans système de disponibilité en temps réel
    •	Aucun suivi de l'état d'une réservation après sa création
    Utilisateurs cibles
    •	Algériens résidant a l'étranger (diaspora) rentrant au pays
    •	Voyageurs arrivant dans l'un des 7 aéroports couverts en Algérie
    •	Administrateurs Airsline gérant la flotte et les réservations

1. Solution proposée:
   
        Développer un backend REST API qui permet a un client de rechercher des voitures disponibles selon un aéroport et des dates, de créer une réservation, et de suivre son statut — sans intégration de paiement dans cette version.
        Ce que le système permet
        •	Consulter la disponibilité des voitures en temps réel par aéroport et dates
        •	Créer une réservation liée a un client et a une voiture
        •	Éviter les conflits de réservation (double booking) automatiquement
        •	Gérer le cycle de vie d'une réservation : en attente → confirmée → retournée → annulée
        •	Offrir un panel admin pour gérer la flotte et les réservations
        •	Envoyer des notifications par email/SMS a la création et confirmation

2. Features & périmètre


        F02	Connexion JWT	Authentification sécurisée, génération de token JWT	Haute	In Scope

        F04	Recherche de voitures	Filtrer par aéroport, date de départ, date de retour	Haute	In Scope

        F05	Disponibilité temps réel	Exclure les voitures déjà réservées sur les dates demandées	Haute	In Scope

        F06	Détail voiture	Voir les infos d'une voiture : modèle, prix/jour, photos, options	Haute	In Scope

        F07	Créer une réservation	Réserver une voiture avec choix de protection (basique / aucune)	Haute	In Scope

        F08	Calcul du prix total	Prix = nb jours x tarif journalier + option protection	Haute	In Scope

