let valueEls = document.querySelectorAll('.val');

valueEls.forEach(value => {
    var v = parseFloat(value.textContent);
    if (v >= 0) value.style.color = "green";
    else {
        value.style.color = "red";
        value.textContent = value.textContent;
    }
});