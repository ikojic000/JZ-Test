$(document).ready(function () {
    const peopleCount = 10;
    const teamCount = peopleCount / 2;
    let people = [];

    $("#addPerson").click(function () {
        $("#personInputs").append('<div class="person"><input type="text" class="name" placeholder="Name"><input type="number" class="score" placeholder="Koeficijent"><button class="removePerson">X</button></div>');
    });

    $("#clearAll").click(function () {
        $("#personInputs").empty();
    });

    $(document).on('click', '.removePerson', function () {
        $(this).parent().remove();
    });

    $("#balanceTeams").click(function () {
        people = [];
        $(".person").each(function () {
            let name = $(this).find(".name").val();
            let score = parseFloat($(this).find(".score").val());
            if (name !== "" && !isNaN(score) && score >= 0 && score <= 100) {
                people.push({ name: name, score: score });
            }
        });

        if (people.length !== peopleCount) {
            alert("Molim unesite točno " + peopleCount + " ljudi!");
            return;
        }



        // Sort people by score in descending order
        people.sort((a, b) => b.score - a.score);

        let bestTeam1 = [];
        let bestTeam2 = [];
        let bestDifference = Infinity;

        // Recursive function to find the best combination of players
        function findBestTeams(team1, team2, index) {
            if (index === people.length) {
                let score1 = team1.reduce((acc, cur) => acc + cur.score, 0);
                let score2 = team2.reduce((acc, cur) => acc + cur.score, 0);
                let difference = Math.abs(score1 - score2);
                if (difference < bestDifference && team1.length === teamCount && team2.length === teamCount) {
                    bestDifference = difference;
                    bestTeam1 = team1.slice();
                    bestTeam2 = team2.slice();
                }
                return;
            }

            // Add current player to team 1
            findBestTeams([...team1, people[index]], team2, index + 1);

            // Add current player to team 2
            findBestTeams(team1, [...team2, people[index]], index + 1);
        }

        // Start recursive function to find the best teams
        findBestTeams([], [], 0);

        // Display teams
        displayTeam("team1", bestTeam1);
        displayTeam("team2", bestTeam2);
    });

    function displayTeam(teamId, team) {
        $("#" + teamId).empty();
        let totalScore = 0;
        team.forEach(function (person) {
            $("#" + teamId).append("<li>" + person.name + " - " + person.score + "</li>");
            totalScore += person.score;
        });
        $("#" + teamId).append("<li>Ukupan koeficijent: " + totalScore.toFixed(2) + "</li>");
    }
});
