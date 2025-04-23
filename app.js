import indexRouter from './routes/indexRouter.js';
import app from './config/app.config.js';

const PORT = process.env.PORT || 3000;

app.use('/', indexRouter);

app.use((req, res) => {
  res.render('notFound', { title: 'Not Found', errMsg: 'Page Not Found' });
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
