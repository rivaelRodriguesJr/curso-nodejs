import Task from '../models/Task';
import * as Yup from 'yup';

class TaskController {
  async index(req, res) {
    const task = await Task.findAll({
      where: [{ check: false }, { user_id: req.userId },],
    })
    return res.json(task);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      task: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    const { task } = req.body;

    const tasks = await Task.create({
      user_id: req.userId,
      task,
    });

    return res.json(tasks);
  }

  async update(req, res) {
    const { task_id } = req.params;
    const { userId } = req;

    const task = await Task.findByPk(task_id);

    if (!task) {
      return res.status(400).json({ error: 'Tarefa não existe' });
    }

    if(userId !== task.userId){
      return res.status(401).json({ error: 'Requisição não autorizado'})
    }

    await task.update(req.body);

    return res.json(task);
  }

  async delete(req, res){
    const { task_id } = req.params;
    const { userId } = req;

    const task = await Task.findByPk(task_id);

    if (!task) {
      return res.status(400).json({ error: 'Tarefa não existe' });
    }

    if(userId !== task.user_id){
      return res.status(401).json({ error: 'Requisição não autorizado'})
    }

    await task.destroy();

    return res.status(204).send();
  }

}

export default new TaskController();
