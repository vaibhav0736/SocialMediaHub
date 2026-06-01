const express=require('express');

const {getOne,getAll,run} =require('../database/db');


const router=express.Router();


//GET notifications for a user

router.get('/:userId',async(req,res)=>{



    try{
        const userId=parseInt(req.params.userId);


        const notifications=getAll(`
            SELECT 
                 notifications.id,
                 notifications.type,
                 notifications.post_id,
                 notifications.message,
                 notifications.is_read,
                 notifications.created_at,
                 users.id as actor_id,
                 users.username as actor_username,
                 users.avatar_url as actor_avatar
            FROM notifications
            INNER JOIN users ON notifications.actor_id = users.id
            WHERE notifications.user_id = ?
            ORDER BY notifications.is_read ASC, notifications.created_at DESC
            LIMIT 50
        `, [userId]);


       res.json(notifications);
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ error: 'Failed to get notifications' });
    }
});


//GET UNread count 
router.get('/:userId/unread-count',async(req,res)=>{
    try{
        const userId=parseInt(req.params.userId);

        const result=getOne(`
            SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0
        `, [userId]);

        res.json(result);
    } catch (error) {
        console.error('Get unread count error:', error);
        res.status(500).json({ error: 'Failed to get unread count' });
    }
})


//MARK aone as read
router.put('/:id/read',async(req,res)=>{
    try{
        const id=parseInt(req.params.id);
        run(`UPDATE notifications SET is_read=1 WHERE id=?`,[id]);
        res.json({message:'Notification marked as read'});
    } catch (error) {
        console.error('Mark as read error:', error);
        res.status(500).json({ error: 'Failed to mark notification as read' });
    }
})


//MARK all as read
router.put('/read-all/:userId',async(req,res)=>{
    try{
        const userId=parseInt(req.params.userId);
        run(`UPDATE notifications SET is_read=1 WHERE user_id=?`,[userId]);
        res.json({message:'All Notifications marked as read'});
    } catch (error) {
        console.error('Mark as read error:', error);
        res.status(500).json({ error: 'Failed to mark all notification as read' });
    }
})

module.exports = router;
