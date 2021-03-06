define(["backbone", "baseview", "mustache", "day", "text!templates/goalTemplate.html"], function(Backbone, BaseView, Mustache, Day, goalTemplate) {

    /**
     * Probably considered as the mainview, in some ways
     * displaying the pure and basic model of a goal
     * @type {GoalView}
     */
	var GoalView = BaseView.extend({

		template: Mustache.compile(goalTemplate),

		initialize: function() {
			// this.el = $("#listGoalsTemplate");
			this.show = false;
			this.day = new Day();

            var that = this;
            this.listenTo(this.model.days, "sync", function() {
                that.showMessage = true;
                that.message = {error: false, message: "The day has been added! Great work!", header: "Success!"};
                that.render();
            });
		},

		events: {
			"click button#delete": "deleteGoal",
			"click button#add-day": "showDescr",
			"click button#addDayButton": "submit",
            "mouseenter div.panel-heading": "hoverGoal",
            "mouseleave div.panel-heading": "unHoverGoal"
		},

		render: function() {

			// Binding the validation to this view
			var that = this;
			Backbone.Validation.bind(this, {
				model: that.day,
				valid: function(view, attr) {
					var $el = view.$("[name=" + attr + "]"),
						$group = $el.closest(".form-group");

					$group.removeClass("has-error");
					$group.find(".day-help-block").html("").addClass("hidden");
				},
				invalid: function(view, attr, error) {
					var $el = view.$("[name=" + attr + "]"),
						$group = $el.closest(".form-group");

					$group.addClass("has-error");
					$group.find(".day-help-block").html(error).removeClass("hidden");
				}
			});

			this.$el.html(this.template(this));

			if(this.show) {
				this.$(".addDay").show();
				this.show = !this.show;
			} else {
				this.$(".addDay").hide();
				this.show = !this.show;
			}

            if(this.showMessage) {
                this.displayMessage(this.message);
            }

			return this;
		},

		// Callbacks
		deleteGoal: function() {
            if(confirm("Are you sure? Deleting is permanent")) {
                this.model.destroy();
            }
		},

		showDescr: function() {

			// Showing and hiding the addDescr-formfield
			var that = this;
			if(this.show) {
				this.$(".addDay").show("slow", function() {
					that.show = !that.show;
				});
			} else {
				this.$(".addDay").hide("slow", function() {
					that.show = !that.show;
				});
			}
		},

		// The actual function for adding a day to the current goal
		submit: function(event) {
			event.preventDefault();

			this.day.set("descr", this.$("input#descr").val());

			if(this.day.isValid(true)) {
				// Add day, with descr to this goal
				this.model.addDay(this.day);
			}
		},

        hoverGoal: function() {
            this.$("div.panel").animate({
               opacity: "0.5"
            });
        },

        unHoverGoal: function() {
            this.$("div.panel").animate({
                opacity: "1"
            });
        },

		// Populate view
		name: function() { return this.model.name(); },
		days: function() { return this.model.days.length; },
		goalId: function() { return this.model.id; },
        active: function() { return this.model.active() },

        dispose: function() {
            Backbone.Validation.unbind(this, {model: this.day});
            this.stopListening();
            this.off();
        }

	});

	return GoalView;

});
