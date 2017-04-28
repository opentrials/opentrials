A new data contribution with the following details has been submitted to OpenTrials:

* Contributor email: {% if user %} {{ user.email }} {% endif %}
* Related trial ID: {{ trial_id }}
* Comments about data contribution: {{ comments }}
* URL to data contribution: <a href="{{ url }}">{{ url }}</a>
* URL to data contribution file: <a href="{{ data_url }}">{{ data_url }}</a>
* Data contribution category: {{ category.name }}
* Data contribution created at: {{ created_at | formatDate }}

View and update submissions by following this link:
https://explorer.opentrials.net/admin/data-contributions
