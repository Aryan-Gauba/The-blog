import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

// Recreate __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ... your app = express() setup ...

// Use the absolute paths
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

let posts = [
  { id: 1, title: "My First Post", content: "Hello World!" }
];

// ADD THIS LINE - It tells Express to expect EJS files
app.set("view engine", "ejs"); 

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    const searchQuery = req.query.search;
    let filteredPosts = posts;

    if (searchQuery) {
        // Filter posts where title or content includes the search string (case-insensitive)
        filteredPosts = posts.filter(post => 
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            post.content.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    res.render("index", { 
        posts: filteredPosts, 
        searchQuery: searchQuery || "" 
    });
});

// Route to show the 'Create' page
app.get("/create", (req, res) => {
    res.render("create.ejs");
});

// Route to handle form data
app.post("/submit", (req, res) => {
    const newPost = {
        id: Date.now(), // Unique ID for later use
        title: req.body.postTitle,
        content: req.body.postContent
    };
    
    posts.push(newPost); // Add it to our array
    res.redirect("/");    // Send the user back home to see it
});

app.post("/delete", (req, res) => {
    const idToDelete = parseInt(req.body.postId);
    // Keep only the posts that DON'T match the ID we want to delete
    posts = posts.filter(post => post.id !== idToDelete);
    res.redirect("/");
});

app.get("/edit/:id", (req, res) => {
    const idToEdit = parseInt(req.params.id);
    const foundPost = posts.find(post => post.id === idToEdit);
    
    if (foundPost) {
        res.render("edit.ejs", { post: foundPost });
    } else {
        res.status(404).send("Post not found");
    }
});

app.post("/update/:id", (req, res) => {
    const idToUpdate = parseInt(req.params.id);
    const postIndex = posts.findIndex(post => post.id === idToUpdate);
    
    if (postIndex !== -1) {
        posts[postIndex].title = req.body.postTitle;
        posts[postIndex].content = req.body.postContent;
    }
    
    res.redirect("/");
});

app.get("/about", (req,res)=>{
    res.render("about.ejs");
})

// app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });

export default app;