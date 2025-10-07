var list_line = document.getElementById("list_line");
var screen_element = document.getElementById("screen");

var list_selected_index = [];
var can_put_password = true;
const password = [0, 3, 6, 4, 5, 2];

const positions = [
    [0, 2, 1],
    [3, 5, 4],
    [6, 8, 7],
    [0, 6, 3],
    [1, 7, 4],
    [2, 8, 5],
    [0, 8, 4],
    [2, 6, 4]
];





function addLineAt(x, y){
    let line = document.createElement('div');
    line.classList.add('line');
    line.style.left = x + 'px';
    line.style.top = y + 'px';
    list_line.appendChild(line);
}




document.querySelectorAll(".slot div").forEach((e, i) => {


    e.onmousedown = (event) => {

        if ( can_put_password ){

            e.parentElement.classList.add('slot_selected', 'slot_selected_start', 'slot_locked');
            list_selected_index.push(i);
            addLineAt(e.offsetLeft + e.offsetWidth/2, e.offsetTop + e.offsetHeight/2);
        }

    };
    


    e.onmousemove = (event) => {

        if ( document.querySelector('.slot_selected_start') && can_put_password ){

            if ( !e.parentElement.classList.contains('slot_locked') ){

                e.parentElement.classList.add('slot_selected', 'slot_locked');
                
                let lastIndex = list_selected_index.slice(-1);
                let oldSlot  = screen_element.children[lastIndex];

                for (let j = 0; j < positions.length; j++){
                    if ( lastIndex == positions[j][0] && i == positions[j][1] || lastIndex == positions[j][1] && i == positions[j][0] ){
                        screen_element.children[ positions[j][2] ].classList.add('slot_selected', 'slot_locked');
                        list_selected_index.push( positions[j][2] );
                        break;
                    }
                }

                list_selected_index.push(i);

                let center_slot = {
                    x: e.offsetLeft + e.offsetWidth/2,
                    y: e.offsetTop + e.offsetHeight/2
                };
                
                let center_slot_old = {
                    x: oldSlot.offsetLeft + oldSlot.offsetWidth/2,
                    y: oldSlot.offsetTop + oldSlot.offsetHeight/2
                };

                let angle = Math.atan2(center_slot_old.x - center_slot.x, center_slot_old.y - center_slot.y);
                let dist  = Math.hypot(center_slot_old.x - center_slot.x, center_slot_old.y - center_slot.y);
                angle = 360 - (angle * 180 / Math.PI + 180);

                
                let currentLine = list_line.children[ list_line.children.length - 1 ];
                currentLine.style.transform = `rotate(${angle+90}deg)`;
                currentLine.style.width = dist + 'px';

                addLineAt(center_slot.x, center_slot.y);
                
            }

        }

    };


});







onmousemove = (event) => {

    if ( document.querySelector('.slot_selected_start') && list_selected_index.length > 0 && can_put_password ){
        
        let currentSlot  = screen_element.children[ list_selected_index.slice(-1) ];
        let currentLine = list_line.querySelector('.line:last-child');

        let center_slot = {
            x: currentSlot.offsetLeft + currentSlot.offsetWidth/2,
            y: currentSlot.offsetTop + currentSlot.offsetHeight/2
        };

        let angle = Math.atan2(event.clientX - center_slot.x, event.clientY - center_slot.y);
        let dist  = Math.hypot(event.clientX - center_slot.x, event.clientY - center_slot.y);
        angle = 360 - (angle * 180 / Math.PI + 180);

        currentLine.style.transform = `rotate(${angle-90}deg)`;
        currentLine.style.width = dist + 'px';

    }
    
};




onmouseup = onblur = () => {

    can_put_password = false;

    let flag_pass = JSON.stringify(password) === JSON.stringify(list_selected_index);
    let currentLine = list_line.querySelector('.line:last-child');

    if ( currentLine ){
        currentLine.remove();
    }
    
    list_selected_index.forEach(e => {
        screen_element.children[e].classList.add( (flag_pass)? 'slot_pass' : 'slot_error' );
    });
    
    list_selected_index = [];
    
    setTimeout(()=>{

        for (e of screen_element.children){
            e.classList.value = 'slot';
        }

        list_line.innerHTML = '';
        can_put_password = true;
    }, 500);
    

};