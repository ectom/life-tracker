import datetime

def get_user_email():
    return None if auth.user is None else auth.user.email

def get_current_time():
    return datetime.datetime.utcnow()

db.define_table('dynamic_dbs',
    Field('table_author', default=get_user_email()),
    Field('table_title'),
    Field('table_fields', 'text'),
    Field('table_field_types', 'text'),
    Field('dynamo_time', 'datetime', update=get_current_time()),
)

db.dynamic_dbs.dynamo_time.readable = db.dynamic_dbs.dynamo_time.writable = False
db.dynamic_dbs.table_author.writable = False
db.dynamic_dbs.id.readable = False
