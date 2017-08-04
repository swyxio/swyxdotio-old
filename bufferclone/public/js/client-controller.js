var vm = new Vue({
  el: '#vm',
  data: {
    shortlinks: []
  },
  methods: {
      newdata: function (d) {
          this.shortlinks = d
      },
    moment: function () {
        return moment();
    }
  }
})

$(document).ready(() => {
    toastr.options.progressBar = true;
    $.get('/getbuffershortlinks', data => {
        console.log('received data', data)
        vm.newdata(data)
    })
    $('#submitbtn').on('click', e => {
        e.preventDefault();
        const obj = {
            link_url: $('#linkurl')[0].value,
            link_comment: $('#linkcomment')[0].value,
            screen: {
                width: screen.width
                , height: screen.height
                , colorDepth: screen.colorDepth
                , 'orientation-angle': screen.orientation.angle
                , 'orientation-type': screen.orientation.type 
            }
        }
        // console.log(obj)
        $.post('/buffercloneapi/', obj, data => {
            console.log('data', data)
            toastr.success(`Link saved with slug ${data.slug}`, 'Link saved!')
        })
        $('#linkurl')[0].value = ''
    })
})
