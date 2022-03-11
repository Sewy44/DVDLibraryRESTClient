$(document).ready(function () {
    loadMovies();
    showCreateDvdForm();
    addMovie();
    hideCreateDvdForm();
    updateDvd();
    leaveSummaryScreen();
    searchMovie();
});

function loadMovies() {
    clearMovieTable();
    let contentRows = $('#contentRows');

    $.ajax({
        type: 'GET',
        url: 'https://localhost:44398/dvds',
        success: function (contactArray) {
            $.each(contactArray, function (index, dvd) {

                let id = dvd.DvdId;
                let title = dvd.Title;
                let releaseYear = dvd.ReleaseYear;
                let director = dvd.Director;
                let rating = dvd.Rating;

                let row = '<tr>';
                row += '<td id=titleColumn><button type="link" id="titleLink" onclick="displaySummary(' + id + ')">' + title + '</button></td>';
                row += '<td>' + releaseYear + '</td>';
                row += '<td>' + director + '</td>';
                row += '<td>' + rating + '</td>';
                row += '<td><button type="button" id="editButton" class="btn btn-link" onclick="showEditForm(' + id + ')">Edit</button></td>';
                row += '<td> | <button type="button" id="edutButton" class="btn btn-link" onclick="deleteDvd(' + id + ')">Delete</button></td>';
                row += '</tr>';

                contentRows.append(row);
            })
        },
        error: function () {
            $('#errorMessages')
                .append($('<li>')
                    .attr({ class: 'list-group-item list-group-item-danger' })
                    .text('Error calling web service. Please try again later.'));
        }
    });
}

function clearMovieTable() {
    $('#contentRows').empty();
}

function showCreateDvdForm() {
    $('#createDvdButton').click(function (event) {
        $('#errorMessages').empty();
        $('#createDvdButton').hide();
        $('#dvdTableDiv').hide();
        $('#createDvdDiv').show();
        $('#searchForm').hide();

    })
}

function hideCreateDvdForm() {
    $('#createCancelButton').click(function (event) {
        $('#errorMessages').empty();
        $('#createDvdDiv').hide();
        $('#dvdTableDiv').show();
        $('#createDvdButton').show();
        $('#searchForm').show();

    })
}

function searchMovie() {
    $('#searchButton').click(function (event) {
        let contentRows = $('#contentRows');
        contentRows.empty();
        let category = $('#categorySelect').val();
        let searchTerm = $('#searchTermInput').val();

        $('#searchForm').click(function (event) {
            let haveValidationErrors = checkAndDisplayValidationErrors($('#searchForm').find('input'));

            if (haveValidationErrors) {
                return false;
            }
        })

        $.ajax({
            type: 'GET',
            url: 'https://localhost:44398/dvds/' + category + '/' + searchTerm,
            success: function (contactArray) {
                $.each(contactArray, function (index, dvd) {
                    let title = dvd.Title;
                    let id = dvd.DvdId;
                    let releaseYear = dvd.ReleaseYear;
                    let director = dvd.Director;
                    let rating = dvd.Rating;

                    let row = '<tr>';
                    row += '<td id=titleRow><button type="link" onclick="displaySummary(' + id + ')">' + title + '</button></td>';
                    row += '<td>' + releaseYear + '</td>';
                    row += '<td>' + director + '</td>';
                    row += '<td>' + rating + '</td>';
                    row += '<td><button type="button" class="btn btn-link" onclick="showEditForm(' + id + ')">Edit</button></td>';
                    row += '<td> | <button type="button" class="btn btn-link" onclick="deleteDvd(' + id + ')">Delete</button></td>';
                    row += '</tr>';

                    contentRows.append(row);
                })
            },
            error: function () {
                $('#errorMessages')
                    .append($('<li>')
                        .attr({ class: 'list-group-item list-group-item-danger' })
                        .text('Error calling web service. Please try again later.'));
            }
        })
    })
}
function addMovie() {
    $('#saveDvd').click(function (event) {

        var haveValidationErrors = checkAndDisplayValidationErrors($('#createForm').find('input'));

        if (haveValidationErrors) {
            return false;
        }

        $.ajax({
            type: 'POST',
            url: 'https://localhost:44398/dvd',
            data: JSON.stringify({
                title: $('#createDvdTitle').val(),
                releaseYear: $('#createReleaseYear').val(),
                director: $('#createDirector').val(),
                rating: $('#ratingSelect').val(),
                notes: $('#createNotes').val()
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            'dataType': 'json',
            success: function () {
                $('#errorMessages').empty();
                $('#createDvdTitle').val('');
                $('#createReleaseYear').val('');
                $('#createDirector').val('');
                $('#ratingSelect').val('');
                $('#createNotes').val('');
                $('#createDvdDiv').hide();
                $('#createDvdButton').show();
                $('#dvdTableDiv').show();
                $('#searchForm').show();
                loadMovies();
            },
            error: function () {
                $('#errorMessages')
                    .append($('<li>')
                        .attr({ class: 'list-group-item list-group-item-danger' })
                        .text('Error calling web service. Please try again later.'));
            }
        })
    });
}

function showEditForm(id) {
    $('#errorMessages').empty();
    $('#createDvdButton').hide();
    $('#dvdTableDiv').hide();
    $('#editDvdDiv').show();
    $('#searchForm').hide();


    $.ajax({
        type: 'GET',
        url: 'https://localhost:44398/dvd/' + id,
        success: function (data, status) {
            $('#editDvdTitle').val(data.Title);
            $('#editReleaseYear').val(data.ReleaseYear);
            $('#editDirector').val(data.Director);
            $('#ratingSelect').val(data.Rating);
            $('#editNotes').val(data.Notes);
            $('#editDvdId').val(data.DvdId);

        },
        error: function () {
            $('#errorMessages')
                .append($('<li>')
                    .attr({ class: 'list-group-item list-group-item-danger' })
                    .text('Error calling web service. Please try again later.'));
        }
    })
}

function hideEditForm() {
    $('#errorMessages').empty();

    $('#editDvdTitle').val('');
    $('#editReleaseYear').val('');
    $('#editDirector').val('');
    $('#ratingSelect').val('');
    $('#editNotes').val('');

    $('#editDvdDiv').hide();
    $('#dvdTableDiv').show();
    $('#createDvdButton').show();
    $('#searchForm').show();

}

function deleteDvd(id) {
    if (confirm("Are you sure you want to delete this DVD from your collection?") == true) {
        $.ajax({
            type: "DELETE",
            url: 'https://localhost:44398/dvd/' + id,
            success: function (data, status) {
                loadMovies();
            },
            'error': function () {
                $('#errorMessages')
                    .append($('<li>')
                        .attr({ class: 'list-group-item list-group-item-danger' })
                        .text('Error calling web service. Please try again later.'));
            }
        })
    }
    else {
        $('#dvdTableDiv').show();
        $('#createDvdButton').show();
    }
}

function updateDvd(id) {
    $('#saveChanges').click(function (event) {

        var haveValidationErrors = checkAndDisplayValidationErrors($('#editForm').find('input'));

        if (haveValidationErrors) {
            return false;
        }


        $.ajax({
            type: 'PUT',
            url: 'https://localhost:44398/dvd/' + $('#editDvdId').val(),
            data: JSON.stringify({
                dvdId: $('#editDvdId').val(),
                title: $('#editDvdTitle').val(),
                releaseYear: $('#editReleaseYear').val(),
                director: $('#editDirector').val(),
                rating: $('#ratingSelect').val(),
                notes: $('#editNotes').val()
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            'success': function () {
                $('#errorMessages').empty();
                hideEditForm();
                loadMovies();
            },
            'error': function () {
                $('#errorMessages')
                    .append($('<li>')
                        .attr({ class: 'list-group-item list-group-item-danger' })
                        .text('Error calling web service. Please try again later.'));
            }
        })
    });
}

function checkAndDisplayValidationErrors(input) {
    $('#errorMessages').empty();

    var errorMessages = [];

    input.each(function () {
        if (!this.validity.valid) {
            var errorField = $('label[for=' + this.id + ']').text();
            errorMessages.push(errorField + ' ' + this.validationMessage);
        }
    });

    if (errorMessages.length > 0) {
        $.each(errorMessages, function (index, message) {
            $('#errorMessages').append($('<li>').attr({ class: 'list-group-item list-group-item-danger' }).text(message));
        });
        return true;
    } else {
        return false;
    }
}

function displaySummary(dvd) {
    $('#dvdSummaryDiv').show();
    $('#dvdTableDiv').hide();
    $('#createDvdButton').hide();
    $('#searchForm').hide();

    $.ajax({
        type: 'GET',
        url: 'https://localhost:44398/dvd/' + dvd,
        success: function (dvd) {
            var id = dvd.DvdId;

            var title = dvd.Title;
            var releaseYear = dvd.ReleaseYear;
            var director = dvd.Director;
            var rating = dvd.Rating;
            var notes = dvd.Notes;
            var movieTitleHeader = $('#movieTitleHeader').append(title);
            var releaseYearRow = $('#releaseYearRow').append(releaseYear);
            var directorRow = $('#directorRow').append(director);
            var ratingRow = $('#ratingRow').append(rating);
            var notesRow = $('#notesRow').append(notes);
        },
        error: function () {
            $('#errorMessages')
                .append($('<li>')
                    .attr({ class: 'list-group-item list-group-item-danger' })
                    .text('Error calling web service. Please try again later.'));
        }
    })
}

function leaveSummaryScreen() {
    $('#back').click(function (event) {
        $('#errorMessages').empty();

        $('#movieTitleHeader').empty();
        $('#releaseYearRow').empty();
        $('#directorRow').empty();
        $('#ratingRow').empty();
        $('#notesRow').empty();
        $('#dvdSummaryDiv').hide();
        $('#dvdTableDiv').show();
        $('#createDvdButton').show();
        $('#searchForm').show();

    })
}

