import json
import datetime

# Here go your api methods.

def get_current_time():
    return datetime.datetime.now()

def is_today(entry_time):
    if entry_time.date() == datetime.datetime.now().date():
        return 'true'
    else:
        return 'false'

@auth.requires_signature()
def add_table():
    table_id = db.dynamic_dbs.insert(
        table_title=request.vars.table_title,
        table_field=request.vars.table_field,
        table_type=request.vars.table_type
    )
    return response.json(dict(table_id=table_id))

def get_dynamic_table_list():
    results = []
    dbs = db(db.dynamic_dbs).select(db.dynamic_dbs.ALL, orderby=~db.dynamic_dbs.dynamo_time)
    for base in dbs:
        results.append(dict(
            id=base.id,
            table_title=base.table_title,
            table_field=base.table_field,
            table_type=base.table_type,
            table_author=base.table_author,
            created=base.created
        ))
    # For homogeneity, we always return a dictionary.
    return response.json(dict(table_list=results))

@auth.requires_signature()
def create_table():
    list = json.loads(request.vars.list)
    for table in list:
        title = table['table_title']
        author = table['table_author']
        field = table['table_field']
        type = table['table_type']

        # creates all tables
        sql = 'CREATE TABLE "' + title + '" ("author" varchar(255), ' + field + ' ' + type + ', "entry_time" TIMESTAMP)'
        db.executesql(sql)

        db((db.dynamic_dbs.table_title == title)).update(
            created = True
        )

# pulls data from any tables that belong to a specific user
@auth.requires_signature()
def get_dash_info():
    entries = []
    empty = []
    now = datetime.datetime.now()
    tables = json.loads(request.vars.tables)
    print 'ALL TABLES: ', tables
    x = 0
    i = 0
    while i < len(tables):
        title = tables[i]['table_title']
        #     # sql = 'SELECT * FROM "' + title + '" WHERE entry_time >= "' + str(now.date()) +' 00:00:00.000000" AND entry_time <= "' + str(now) + '"'
        #     # sql = 'SELECT * FROM "'+title+'" WHERE DATE(entry_time) = DATE("now", "-1 day")'
        sql = 'SELECT * FROM "'+title+'" WHERE author = "' + auth.user.email + '" ORDER BY entry_time DESC LIMIT 1'
        entry_of_today = db.executesql(sql)
        print title,':', entry_of_today
        if len(entry_of_today) > 0:
            x = dict(
                author=entry_of_today[0][0],
                _entry=entry_of_today[0][1],
                entry_time=entry_of_today[0][2],
                table_field=tables[i]['table_field'],
                table_title=tables[i]['table_title'],
                table_type=tables[i]['table_type']
            )
            entries.append(x)
        else:
            empty.append(tables[i])
        i += 1
    return response.json(dict(entries=entries, empty=empty))

@auth.requires_signature()
def add_entry():
    table = json.loads(request.vars.table)
    title = table['table_title']
    param = table['table_field']
    author = table['table_author']
    entry = str(table['_entry'])
    time = str(get_current_time())
    db.executesql('INSERT INTO "'+title+'" (author, '+param+', entry_time) VALUES ("'+author+'","'+entry+'", "'+time+'");')
    return title

@auth.requires_signature()
def get_all_data():
    table = request.vars.table
    field = request.vars.field
    author = auth.user.email
    list = db.executesql('SELECT entry_time, ' + field + ' FROM ' + table + ' WHERE author = "' + author +'"');
    return response.json(dict(list=list))

# @auth.requires_signature()
# def set_thumb():
#     post_id = int(request.vars.post_id)
#     thumb_state = request.vars.thumb
#     db.thumb.update_or_insert(
#         (db.thumb.post_id == post_id) & (db.thumb.user_email == auth.user.email),
#         post_id = post_id,
#         user_email = auth.user.email,
#         thumb_state = thumb_state
#     )
#     return "ok" # Might be useful in debugging.
#
# def get_thumbs():
#     likes = len(db((db.thumb.post_id == request.vars.post_id) & (db.thumb.thumb_state == 'u')).select())
#     dislikes = len(db((db.thumb.post_id == request.vars.post_id) & (db.thumb.thumb_state == 'd')).select())
#     total = likes-dislikes
#     return response.json(dict(total=total))
#     # """Gets the list of people who liked a post."""
#     # # We get directly the list of all the users who liked the post.
#     # rows = db().select(db.thumb.ALL)
#     # # If the user is logged in, we remove the user from the set.
#     # thumbs_set = set([r for r in rows])
#     # thumbs_list = list(thumbs_set)
#     # thumbs_list.sort()
#     # # # We return this list as a dictionary field, to be consistent with all other calls.
#     # return response.json(dict(thumbs=thumbs_list))
#
# @auth.requires_signature()
# def edit_post():
#
#     print req.vars.id
#     print req.vars.post_content
#     return "ok"
