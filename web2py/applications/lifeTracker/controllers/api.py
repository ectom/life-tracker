# Here go your api methods.
@auth.requires_signature()
def add_table():
    table_id = db.dynamic_dbs.insert(
        table_title=request.vars.table_title,
        table_field=request.vars.table_field,
        table_type=request.vars.table_type
    )
    return response.json(dict(table_id=table_id))

def get_table_list():
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

def create_table():
    list = request.vars.list
    print list
    for table in list:
        db.executesql('CREATE TABLE ' + table.table_title +' ('+
            list.table_author+' varchar(255),'+
            list.table_field+' '+list.table_type+', time TIMESTAMP DEFAULT SYSDATETIME())'
        )
        # db((db.dynamic_dbs))
    return "ok"
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
