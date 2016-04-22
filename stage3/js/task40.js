var CalendarComponent = Hum.createClass(Calendar, {
    className: {
        'calendar': 'calendar',
        'controlBar': 'controlBar',
        'calendarBar': 'calendarBar',
        'yearBar': 'yearBar',
        'monthBar': 'monthBar',
        'dayBar': 'dayBar',
        'dateBar': 'dateBar',
        'date': 'date',
        'focusDate': 'focusDate',
        'selector': 'selector',
        'commitBar': 'commitBar',
        'calendarWrapper': 'calendarWrapper'
    }
});

var realDOM = CalendarComponent.render();

Hum.render(
    realDOM,
    document.body
);
