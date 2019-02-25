$(document).ready(() => {

    //Rearrange the received dob to mm/dd/yyy
    const setBirthday = (birthday) => {
        let birthdayFormat = new Date(birthday).toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' });
        return birthdayFormat;
    }

    //Employee Info Div
    const employeeData = (data) => {
        //data.results[0] - set variable for the needed information
        let image = data.picture.large;
        let name = `${data.name.first} ${data.name.last}`;
        let email = data.email;
        let city = data.location.city;
        let username = data.login.username;
        let cell = data.phone;
        let fullAddress = `${data.location.street}, ${city}, ${data.location.state} ${data.location.postcode}`;
        let birthday = setBirthday(data.dob.date);
        let nationality= data.nat;
        
        //build the list items and the modal window divs
        let employeeList = `<li class="employee">
                              <a data-modal-open="${username}" href="#">
                                <div class="images"><img src="${image}" alt="profile image">
                                </div>
                                <div class="content">
                                  <h3 class="capitalize">${name}</h3>
                                  <p>${email}</p>
                                  <p class="capitalize">${city}</p>
                                </div>
                              </a>
                            </li>`;
        let employeeModal = `<div class="modal" data-modal="${username}">
                              <div class="modal-content">
                                  <a class="modal-close" data-modal-close="${username}" href="#">x</a>
                                  <a id="prev" class="arrows" href="#" data-arrow="prev"><</a>
                                  <a class="arrows" id="next" href="#" data-arrow="next">></a>
                                  <img src="${image}" alt="profile image">
                                  <h3 class="capitalize">${name}</h3>
                                  <p>${email}</p><p class="capitalize">${city}</p>
                              <div class="line-break"></div>
                                  <h3>Employee Details</h3>
                                  <p>${username}</p><p>${cell}</p>
                                  <p class="capitalize">${fullAddress}</p>
                                  <p>${birthday}</p><p>${nationality}</p>
                             </div>
                             </div>`;
        employeeList += employeeModal;
        //append them to the page
        $('#list').append(employeeList);
    }

    //call a request to receive 12 fake employees for the mockup
    $.ajax({
      url: 'https://randomuser.me/api/?nat=us&results=20',
      dataType: 'json',
      success: function(data) {
          //interate through the data received to build out the page
          for( let i = 0; i < data.results.length; i++) {
              employeeData(data.results[i]);
          }
      }
    });

    /////////////////MODAL WINDOWS////////////////////////

    //on click of the li element
    $('body').on('click', '[data-modal-open]', (e) => {
        //grab the username of the li's employee
        let target = $(e.currentTarget).attr('data-modal-open');
        //show matching modal window
        $(`[data-modal="${target}"]`).show();
    });

    //on click of the modal X close button
    $('body').on('click', '[data-modal-close]', (e) => {
        //grab the username of the modals' employee
        let target = $(e.target).attr('data-modal-close');
        //hide matching modal window
        $(`[data-modal="${target}"]`).hide();
        //prevent default click events
        e.preventDefault();
    });

    //on click outside of the modal - hide the currently open modal
    $('body').on('click', '.modal', (e) => {
        //grab the username of the modals' employee
        let target = $(e.target).find('a').attr('data-modal-close');
        //hide matching modal window
        $(`[data-modal="${target}"]`).hide();
        //prevent default click events
        e.preventDefault();
    });

    ////////////////////SEARCH/////////////////
    //Search through the students and find those that match the search
    const findPerson = () => {
        $('#none').hide();
        //get the item that was searched
        let searchItem = $('#search input').val().toLowerCase();
        //find all items that contain the searched item
        let returnedItems = $(`li:contains('${searchItem}')`);
        //return the search box value to empty
        $('#search input').val('');
        //return the results to create the page
        $('.employee').hide();
        if (returnedItems[0] === undefined) {
            $('#list').append('<p id="none">Search Result : Not found.</p>');
        } else {
            returnedItems.show();
        }
    }

    $('#search button').click(() => {
        findPerson();
    });

    $('#search input').bind('keypress', (event) => {
        if (event.keyCode === 13) {
            findPerson();
        }
    });

    ///////////////////////////ARROW TO CHANGE MODALS///////////////////////////
    //capture click event on the modal
    $('body').on('click','#prev', (e) => {
        $(e.target).closest('.modal').hide().prevAll('.modal:first').show();
    });

    $('body').on('click','#next', (e) => {
        $(e.target).closest('.modal').hide().nextAll('.modal:first').show();
    });

});
