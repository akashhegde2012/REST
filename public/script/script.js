header=document.querySelector('#header');
content=document.querySelector('.ui.top.attached.segment');
var header_text='Blog App';
header.style.color='white';
button=document.querySelector('button');
var display=true;
button.addEventListener('click',function(){
    if (display)
    {content.style.display='none';
    display=false;
        this.textContent='Show'}
    else {
    content.style.display='block';
    this.textContent='Hide'
    display=true;}
})


