const express = require("express");
const router = express.Router();
const Event = require("../../models/EventSchema.js"); // Import your Event model
const moment = require("moment-timezone");
const authenticateMiddleware = require("../../auth/authenticateMiddleware.js");
const { createLog } = require("../recordLogRouter.js");

router.use(authenticateMiddleware);

// Create a new event
router.post("/createEvent", async (req, res) => {
  try {
    const { title, description, startDateTime, endDateTime } = req.body;
    const event = new Event({
      title,
      description,
      startDateTime,
      endDateTime,
    });
    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
    await createLog('Event', 'CREATE', `${savedEvent}`, req.userData.userId);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Unable to create event" });
  }
});

router.get("/fetchEvent", async (req, res) => {
  try {
    const events = await Event.find();

    // Convert the UTC dates to Taiwan time zone
    const eventsInTaiwanTime = events.map((event) => ({
      ...event.toObject(),
      startDateTime: moment(event.startDateTime).tz("Asia/Taipei").format(), // Convert start date
      endDateTime: moment(event.endDateTime).tz("Asia/Taipei").format(), // Convert end date
    }));

    res.json(eventsInTaiwanTime);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Unable to fetch events" });
  }
});

// Get a single event by ID
router.get("/fetchEvent/:eventId", async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ error: "Unable to fetch event" });
  }
});

// Update an event by ID
router.put("/updateEvent/:eventId", async (req, res) => {
  try {
    const { title, description, startDateTime, endDateTime } = req.body;
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.eventId,
      {
        title,
        description,
        startDateTime,
        endDateTime,
      },
      { new: true }
    );
    if (!updatedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json(updatedEvent);
    await createLog('Event', 'UPDATE', `${updatedEvent}`, req.userData.userId);
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ error: "Unable to update event" });
  }
});

// Delete an event by ID
router.delete("/deleteEvent/:eventId", async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndRemove(req.params.eventId);
    if (!deletedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json(deletedEvent);
    await createLog('Event', 'DELETE', `${deletedEvent}`, req.userData.userId);
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Unable to delete event" });
  }
});

module.exports = router;
