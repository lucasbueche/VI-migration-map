var modal = {
    model: {
        modalBody: "faker.lorem.sentences(3)",
        showModal: false,
        $showModal (country, date) {
            this.modalTitle = "Details for " + country + " in time period " + (date-5)+"-"+date;
            d3.queue()
                .defer(d3.csv, "https://raw.githubusercontent.com/lucasbueche/VI-migration-map/main/data/CSV/dataset_"+date+".csv", function(d) { data.set(d.code, +d.norm_sold); })
                .await(findMaxMigration);
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
        $modal(country, date) {
            var modal = vm.select('.modal');

            if (!modal.size())
                vm.select('body').append('modal').mount(null, v => v.model.$showModal(country, date));
            else
                modal.model().$showModal(country, date);
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

function findMaxMigration(error, topo){
    
}