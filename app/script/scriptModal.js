var modal = {
    model: {
        showModal: false,
        $showModal (country, date, emmigration, immigration) {
            this.modalTitle = "Details for " + country + " in " +date;
            this.modalBody = "Country most emigrated to: " + emmigration[0] + "<br/>"
            this.modalBody += "Total people born in "+ country +" living in " + emmigration[0] +" in "+ date + ": " + emmigration[1] +"<br/>"
            this.modalBody += "<br/> Country most immigrated from: " + immigration[0] + "<br/>"
            this.modalBody += "Total people born in "+ immigration[0] +" living in " + country +" in "+ date + ": " + immigration[1]
            this.showModal = true;
        },
        $hideModal () {
            this.showModal = false;
        }
    },
    directive: {
        refresh (model, show) {
            if (!this.passes) return;
            var sel = this.sel,
                modal = sel.classed('modal');
            if (show) {
                sel.style('display', 'block').classed('show', true);
                if (modal) {
                    var height = sel.style('height');
                    sel.style('top', '-' + height);
                    this.transition(sel).ease(d3.easeExpOut).style('top', '0px');
                }
            }
            else {
                var op = sel.style('opacity'),
                    t = this.transition(sel);
                sel.classed('show', false);
                if (modal) {
                    var height = sel.style('height');
                    t.style('top', '-' + height).on('end', function () {
                        sel.style('display', 'none');
                    });
                } else
                    t.style('opacity', 0);
                t.on('end', function () {
                    sel.style('display', 'none').style('opacity', op);
                });
            }
        }
    },
    render: function () {
        return this.renderFromUrl('../html/modal.html')
    }
    
};

var vm = d3.view({
    model: {
        $modal(country, date, emmigration, immigration) {
            var modal = vm.select('.modal');
            if (!modal.size())
                vm.select('body').append('modal').mount(null, v => v.model.$showModal(country, date, emmigration, immigration));
            else
                modal.model().$showModal(country, date, emmigration, immigration);
        }
    },
    components: {
        modal: modal
    },
    directives: {
        modal: modal.directive
    }
});
vm.mount('body');