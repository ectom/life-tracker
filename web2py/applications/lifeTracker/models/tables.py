# Define your tables below (or better in another model file) for example
#
# >>> db.define_table('mytable', Field('myfield', 'string'))
#
# Fields can be 'string','text','password','integer','double','boolean'
#       'date','time','datetime','blob','upload', 'reference TABLENAME'
# There is an implicit 'id integer autoincrement' field
# Consult manual for more options, validators, etc.
# after defining tables, uncomment below to enable auditing
# auth.enable_record_versioning(db)


import datetime

def get_user_email():
    return None if auth.user is None else auth.user.email

def get_current_time():
    return datetime.datetime.utcnow()

db.define_table('dynamic_dbs',
    Field('table_author', default=get_user_email()),
    Field('table_title'),
    Field('table_field', 'text'),
    Field('table_type', 'text'),
    Field('created', default=False),
    Field('dynamo_time', 'datetime', update=get_current_time()),
)

db.dynamic_dbs.dynamo_time.readable = db.dynamic_dbs.dynamo_time.writable = False
db.dynamic_dbs.table_author.writable = False
db.dynamic_dbs.id.readable = False
