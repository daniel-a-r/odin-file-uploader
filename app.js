import app from './config/app.config.js';
import indexRouter from './routes/indexRouter.js';
import dashboardRouter from './routes/dashboardRouter.js';

const PORT = process.env.PORT || 3000;

app.use('/', indexRouter);
app.use('/dashboard', dashboardRouter);

app.use((req, res) => {
  res
    .status(404)
    .render('notFound', { title: 'Not Found', errMsg: 'Page Not Found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('error', { errorMsg: err.message });
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
