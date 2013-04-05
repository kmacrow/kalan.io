
(function(){

  function layout() 
  {
    $('.region').css('height', window.innerHeight + 'px');
    $('.c-body p').hyphenate('en-us');
  }

  function bumpLayer(n) 
  {

    function bump(a) {
      var x = 1 / (.1 + Math.random()),
          y = 2 * Math.random() - .5,
          z = 10 / (.1 + Math.random());
      for (var i = 0; i < n; i++) {
        var w = (i / n - y) * z;
        a[i] += x * Math.exp(-w * w);
      }
    }

    var a = [], i;
    for (i = 0; i < n; ++i) a[i] = 0;
    for (i = 0; i < 5; ++i) bump(a);
    return a.map(function(d, i) { return {x: i, y: Math.max(0, d)}; });
  }

  function gitvis() 
  {
    var n, m, uw, data, layers, stack, html; // number of layers, samples
    var x, y, colors, area, svg, days, months;
    var width = window.innerWidth,
       height = window.innerHeight/2;

    function showTooltip(text, x, y) {
      $('#gitvis_tooltip')
      .html(text)
      .css({'left': (x + 20) + 'px', 'top': (y - 20) + 'px'})
      .show();
    }

    function hideTooltip() {
      $('#gitvis_tooltip').hide();
    }
    
    days   = ['Su','Mo','Tu','We','Th','Fr','Sa'];
    months = ['January','February','March','April','May','June','July','August',
              'September','October','November','December'];

    data = [];
    html = '';
    // unit width of day labels
    uw = Math.floor(width/30.5);

    stack = d3.layout.stack()
            .offset("wiggle")
            .values(function(d){return d.values});

    for(var i = 0; i < 17; i++)
      data.push({'name': 'Foobar', 'values': bumpLayer(30)});

    n = data.length;
    m = data[0].values.length;

    layers = stack(data);

    x = d3.scale.linear()
        .domain([0, m - 1])
        .range([0, width]);

    y = d3.scale.linear()
        .domain([0, d3.max(layers, function(layer) { 
          return d3.max(layer.values, function(d) { 
              return d.y0 + d.y; 
            }); 
        })])
        .range([height, 0]);

    colors = d3.scale.linear()
                 .range(["#82df80", "#0b8208"]);

    area = d3.svg.area()
           .x(function(d) { return x(d.x); })
           .y0(function(d) { return y(d.y0); })
           .y1(function(d) { return y(d.y0 + d.y); });

    svg = d3.select("#gitvis").append("svg")
          .attr("width", width)
          .attr("height", height);

    svg.selectAll("path")
      .data(layers)
      .enter().append("path")
      .style("fill", function() { return colors(Math.random()); })
      .attr("d", function(d) { return area(d.values); })
      .on('mouseover', function(d){
        if(!$(this).data('live')) {
          var path = d3.select(this);
          var fill = path.style('fill');
          path.style('fill', '#065704');
          $(this).data('fill', fill);
          $(this).data('live', true);
          showTooltip('Hello!', d3.event.clientX, d3.event.clientY);
        }
      })
      .on('mouseout', function(d){
        var path = d3.select(this);
        path.style('fill', $(this).data('fill'));
        $(this).data('live', false);
        hideTooltip();
      })

    // fill x-axis
    $('#gitvis_month').html(months[Math.floor(Math.random()*months.length)]);
    
    for(var i = 0; i < 30; i++){
      html += '<div class="unit">'+days[i%7]+'</div>';
    }

    $('#gitvis_line').html(html);
    $('#gitvis_line > .unit').css('width', uw + 'px');
  }

  $(document).ready(layout);
  $(window).resize(layout);

  $(document).ready(function(){
    var gity = $('#github').offset().top;
    var gith = $('#github').height();
    var gitv = false;
    console.log(gity);
    $(window).scroll(function(e){
      if(!gitv && $(window).scrollTop() >= gity-gith/2){
        gitv = true;
        gitvis();
      }
    })
  })

})();

